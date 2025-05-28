const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@ailuminate.com"
    const password = process.env.ADMIN_PASSWORD || "Admin123!"
    const username = process.env.ADMIN_USERNAME || "admin"
    const name = process.env.ADMIN_NAME || "Administrator"

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      console.log("Admin already exists with email:", email)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
      },
    })

    console.log("Admin created successfully!")
    console.log("Email:", email)
    console.log("Username:", username)
    console.log("Password:", password)
    console.log("Please change the password after first login.")
  } catch (error) {
    console.error("Error creating admin:", error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
