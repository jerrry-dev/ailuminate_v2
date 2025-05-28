import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectToMongoDB from "@/lib/mongodb"
import prisma from "@/lib/prisma"
import Article from "@/models/Article"
import { commentSchema } from "@/lib/validations/article"

// Utility to extract article ID from the URL
function extractArticleId(url: string): string | null {
  const parts = new URL(url).pathname.split("/")
  const idIndex = parts.indexOf("articles") + 1
  return parts[idIndex] || null
}

// GET comments for an article
export async function GET(req: NextRequest) {
  try {
    const id = extractArticleId(req.url)
    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
    }

    await connectToMongoDB()

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
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = extractArticleId(req.url)
    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
    }

    const body = await req.json()
    const validationResult = commentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.errors }, { status: 400 })
    }

    const { content } = validationResult.data

    await connectToMongoDB()

    const article = await Article.findById(id)
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const comment = {
      userId: user.id,
      content,
      createdAt: new Date(),
    }

    article.comments.push(comment)
    await article.save()

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
