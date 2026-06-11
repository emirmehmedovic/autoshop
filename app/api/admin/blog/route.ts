import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const blogPostSchema = z.object({
  title: z.string().min(2, "Naslov mora imati najmanje 2 karaktera"),
  content: z.string().min(10, "Sadržaj mora imati najmanje 10 karaktera"),
  excerpt: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
})

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "dj")
    .replace(/Đ/g, "Dj")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju" },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = blogPostSchema.parse(body)

    // Generate unique slug
    let slug = generateSlug(validatedData.title)
    let slugExists = await prisma.blogPost.findUnique({
      where: { slug },
    })

    let counter = 1
    while (slugExists) {
      slug = `${generateSlug(validatedData.title)}-${counter}`
      slugExists = await prisma.blogPost.findUnique({
        where: { slug },
      })
      counter++
    }

    // Parse publishedAt if provided
    const publishedAt = validatedData.publishedAt
      ? new Date(validatedData.publishedAt)
      : validatedData.isPublished
        ? new Date()
        : null

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt || null,
        imageUrl: validatedData.imageUrl || null,
        isPublished: validatedData.isPublished,
        metaTitle: validatedData.metaTitle || null,
        metaDesc: validatedData.metaDesc || null,
        publishedAt,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Greška pri kreiranju blog posta" },
      { status: 500 }
    )
  }
}
