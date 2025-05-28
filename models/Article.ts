import mongoose, { Schema, type Document } from "mongoose"

export interface IArticle extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  content: string
  excerpt: string
  slug: string
  status: "draft" | "published"
  tags: string[]
  thumbnail: string
  readTime: number
  authorId: string
  createdAt: Date
  updatedAt: Date
  likes: string[] // Array of user IDs who liked the article
  comments: {
    userId: string
    content: string
    createdAt: Date
  }[]
}

const ArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    tags: [{ type: String }],
    thumbnail: { type: String },
    readTime: { type: Number, default: 0 },
    authorId: { type: String, required: true },
    likes: [{ type: String }],
    comments: [
      {
        userId: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

// Create text indexes for search
ArticleSchema.index({ title: "text", content: "text", tags: "text" })

export default mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema)
