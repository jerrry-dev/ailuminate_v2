import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectToMongoDB from "@/lib/mongodb"
import prisma from "@/lib/prisma"
import Article from "@/models/Article"
import { updateArticleSchema } from "@/lib/validations/article"
import { generateSlug, calculateReadTime, isValidObjectId } from "@/lib/utils"

// GET single article
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Connect to MongoDB
    await connectToMongoDB()

    let article

    // Check if ID is MongoDB ObjectId or slug
    if (isValidObjectId(id)) {
      article = await Article.findById(id)
    } else {
      article = await Article.findOne({ slug: id })
    }

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Increment view count
    await prisma.article.update({
      where: { mongoId: article._id.toString() },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({ article })
  } catch (error) {
    console.error("Get article error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// PUT update article
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()

    // Validate input
    const validationResult = updateArticleSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.errors }, { status: 400 })
    }

    // Connect to MongoDB
    await connectToMongoDB()

    // Find article
    const article = await Article.findById(id)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Check ownership
    if (article.authorId !== user.id) {
      return NextResponse.json({ error: "You do not have permission to update this article" }, { status: 403 })
    }

    const { title, content, excerpt, tags, thumbnail, status } = validationResult.data

    // Generate new slug if title changed
    let slug = article.slug
    if (title && title !== article.title) {
      slug = generateSlug(title)

      // Check if new slug exists
      const existingArticle = await Article.findOne({ slug, _id: { $ne: id } })
      if (existingArticle) {
        // Append random string to make slug unique
        slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`
      }
    }

    // Calculate read time if content changed
    let readTime = article.readTime
    if (content && content !== article.content) {
      readTime = calculateReadTime(content)
    }

    // Update article in MongoDB
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt && { excerpt }),
        ...(tags && { tags }),
        ...(thumbnail && { thumbnail }),
        ...(status && { status }),
        slug,
        readTime,
        updatedAt: new Date(),
      },
      { new: true },
    )

    // Update reference in PostgreSQL
    await prisma.article.update({
      where: { mongoId: id },
      data: {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(status && { status }),
        slug,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ article: updatedArticle })
  } catch (error) {
    console.error("Update article error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// DELETE article
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Connect to MongoDB
    await connectToMongoDB()

    // Find article
    const article = await Article.findById(id)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Check ownership (or admin status)
    const isAdmin = req.cookies.get("admin_token")?.value
    if (article.authorId !== user.id && !isAdmin) {
      return NextResponse.json({ error: "You do not have permission to delete this article" }, { status: 403 })
    }

    // Delete article from MongoDB
    await Article.findByIdAndDelete(id)

    // Delete reference from PostgreSQL
    await prisma.article.delete({
      where: { mongoId: id },
    })

    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Delete article error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
