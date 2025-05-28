  import { type NextRequest, NextResponse } from "next/server"
  import { getCurrentUser } from "@/lib/auth"
  import connectToMongoDB from "@/lib/mongodb"
  import prisma from "@/lib/prisma"
  import Article from "@/models/Article"
  import { updateArticleSchema } from "@/lib/validations/article"
  import { generateSlug, calculateReadTime, isValidObjectId } from "@/lib/utils"

  // Utility to extract ID from request URL
  function extractIdFromUrl(url: string): string | null {
    const parts = url.split("/")
    const id = parts[parts.length - 1] || parts[parts.length - 2]
    return id || null
  }

  // GET single article
  export async function GET(req: NextRequest) {
    try {
      const id = extractIdFromUrl(req.url)
      if (!id) {
        return NextResponse.json({ error: "Invalid article ID" }, { status: 400 })
      }

      await connectToMongoDB()

      let article
      if (isValidObjectId(id)) {
        article = await Article.findById(id)
      } else {
        article = await Article.findOne({ slug: id })
      }

      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }

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
  export async function PUT(req: NextRequest) {
    try {
      const user = await getCurrentUser(req)
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const id = extractIdFromUrl(req.url)
      if (!id) {
        return NextResponse.json({ error: "Invalid article ID" }, { status: 400 })
      }

      const body = await req.json()
      const validationResult = updateArticleSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json({ error: "Validation failed", details: validationResult.error.errors }, { status: 400 })
      }

      await connectToMongoDB()
      const article = await Article.findById(id)

      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }

      if (article.authorId !== user.id) {
        return NextResponse.json({ error: "You do not have permission to update this article" }, { status: 403 })
      }

      const { title, content, excerpt, tags, thumbnail, status } = validationResult.data

      let slug = article.slug
      if (title && title !== article.title) {
        slug = generateSlug(title)
        const existing = await Article.findOne({ slug, _id: { $ne: id } })
        if (existing) {
          slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`
        }
      }

      let readTime = article.readTime
      if (content && content !== article.content) {
        readTime = calculateReadTime(content)
      }

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
  export async function DELETE(req: NextRequest) {
    try {
      const user = await getCurrentUser(req)
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const id = extractIdFromUrl(req.url)
      if (!id) {
        return NextResponse.json({ error: "Invalid article ID" }, { status: 400 })
      }

      await connectToMongoDB()
      const article = await Article.findById(id)

      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }

      const isAdmin = req.cookies.get("admin_token")?.value
      if (article.authorId !== user.id && !isAdmin) {
        return NextResponse.json({ error: "You do not have permission to delete this article" }, { status: 403 })
      }

      await Article.findByIdAndDelete(id)
      await prisma.article.delete({
        where: { mongoId: id },
      })

      return NextResponse.json({ message: "Article deleted successfully" })
    } catch (error) {
      console.error("Delete article error:", error)
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
  }
