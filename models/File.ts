import mongoose, { Schema, type Document } from "mongoose"

export interface IFile extends Document {
  name: string
  url: string
  type: string
  size: number
  authorId: string
  articleId?: string
  messageId?: string
  createdAt: Date
  updatedAt: Date
}

const FileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    authorId: { type: String, required: true },
    articleId: { type: String },
    messageId: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.File || mongoose.model<IFile>("File", FileSchema)
