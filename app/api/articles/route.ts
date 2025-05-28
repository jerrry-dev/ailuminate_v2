import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectToMongoDB from "@/lib/mongodb"
import prisma from "@/lib/prisma"
import Article from "@/models/Article"
import { createArticleSchema } from "@/lib/validations/article"
import { generateSlug, calculateReadTime } from "@/lib/utils"

// GET all articles (with pagination and filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    const status = searchParams.get("status") || "published"
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")
    const authorId = searchParams.get("authorId")

    const skip = (page - 1) * limit

    await connectToMongoDB()

    const query: any = { status }
    if (tag) query.tags = tag
    if (authorId) query.authorId = authorId
    if (search) query.$text = { $search: search }

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Article.countDocuments(query)

    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get articles error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// POST create new article
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validationResult = createArticleSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { title, content, excerpt, tags, thumbnail, status } = validationResult.data

    let slug = generateSlug(title)

    await connectToMongoDB()

    const existingArticle = await Article.findOne({ slug })
    if (existingArticle) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`
    }

    const readTime = calculateReadTime(content)

    const article = await Article.create({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + "...",
      slug,
      status,
      tags: tags || [],
      thumbnail,
      readTime,
      authorId: user.id,
    })

    await prisma.article.create({
      data: {
        mongoId: article._id.toString(),
        title,
        slug,
        excerpt: excerpt || content.substring(0, 150) + "...",
        status,
        authorId: user.id,
      },
    })

    return NextResponse.json({ article }, { status: 201 })
  } catch (error) {
    console.error("Create article error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
