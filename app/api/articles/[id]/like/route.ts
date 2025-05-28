import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectToMongoDB from "@/lib/mongodb"
import prisma from "@/lib/prisma"
import Article from "@/models/Article"

// POST like/unlike article
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user already liked the article
    const userLiked = article.likes.includes(user.id)

    if (userLiked) {
      // Unlike
      article.likes = article.likes.filter((userId: string) => userId !== user.id)
      await prisma.article.update({
        where: { mongoId: id },
        data: { likeCount: { decrement: 1 } },
      })
    } else {
      // Like
      article.likes.push(user.id)
      await prisma.article.update({
        where: { mongoId: id },
        data: { likeCount: { increment: 1 } },
      })
    }

    await article.save()

    return NextResponse.json({
      message: userLiked ? "Article unliked" : "Article liked",
      liked: !userLiked,
      likeCount: article.likes.length,
    })
  } catch (error) {
    console.error("Like article error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
