import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectToMongoDB from "@/lib/mongodb"
import prisma from "@/lib/prisma"
import Article from "@/models/Article"
import { commentSchema } from "@/lib/validations/article"

// GET comments for an article
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Connect to MongoDB
    await connectToMongoDB()

    // Find article
    const article = await Article.findById(id)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ comments: article.comments })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// POST add comment to article
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()

    // Validate input
    const validationResult = commentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.errors }, { status: 400 })
    }

    const { content } = validationResult.data

    // Connect to MongoDB
    await connectToMongoDB()

    // Find article
    const article = await Article.findById(id)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Add comment
    const comment = {
      userId: user.id,
      content,
      createdAt: new Date(),
    }

    article.comments.push(comment)
    await article.save()

    // Update comment count in PostgreSQL
    await prisma.article.update({
      where: { mongoId: id },
      data: { commentCount: { increment: 1 } },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error("Add comment error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
