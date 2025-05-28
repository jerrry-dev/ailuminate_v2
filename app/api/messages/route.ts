import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { sendMessageSchema } from "@/lib/validations/message"

// GET messages (with pagination)
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const recipientId = searchParams.get("recipientId")

    const skip = (page - 1) * limit

    // Build query
    const query: any = {
      OR: [{ senderId: user.id }, { recipientId: user.id }],
    }

    // If recipientId is provided, filter conversation with that user
    if (recipientId) {
      query.OR = [
        { AND: [{ senderId: user.id }, { recipientId }] },
        { AND: [{ senderId: recipientId }, { recipientId: user.id }] },
      ]
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: query,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        recipient: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        files: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    // Get total count
    const total = await prisma.message.count({ where: query })

    // Mark messages as read if they were sent to the current user
    if (messages.length > 0) {
      await prisma.message.updateMany({
        where: {
          id: { in: messages.map((m) => m.id) },
          recipientId: user.id,
          read: false,
        },
        data: { read: true },
      })
    }

    return NextResponse.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// POST send message
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate input
    const validationResult = sendMessageSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.errors }, { status: 400 })
    }

    const { recipientId, content, fileIds } = validationResult.data

    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    })

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        recipientId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        recipient: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // If fileIds are provided, link files to message
    if (fileIds && fileIds.length > 0) {
      await prisma.file.updateMany({
        where: { id: { in: fileIds } },
        data: { messageId: message.id },
      })
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
