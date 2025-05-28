import type { PrismaClient } from "@prisma/client"

declare global {
  var __global_prisma__: PrismaClient | undefined
  var mongoose: {
    conn: any | null
    promise: Promise<any> | null
  }
}
