import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { unlink } from "fs/promises"
import { join } from "path"

const blogPostUpdateSchema = z.object({
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

async function deleteImageFile(url: string) {
  try {
    if (url.startsWith("/images/blog/")) {
      const filename = url.split("/").pop()
      if (filename) {
        const filePath = join(process.cwd(), "public", "images", "blog", filename)
        await unlink(filePath)
      }
    }
  } catch (error) {
    console.error("Error deleting image file:", error)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju" },
        { status: 403 }
      )
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post nije pronađen" },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = blogPostUpdateSchema.parse(body)

    // Generate slug if title changed
    let slug = existingPost.slug
    if (validatedData.title !== existingPost.title) {
      slug = generateSlug(validatedData.title)
      let slugExists = await prisma.blogPost.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      })

      let counter = 1
      while (slugExists) {
        slug = `${generateSlug(validatedData.title)}-${counter}`
        slugExists = await prisma.blogPost.findFirst({
          where: {
            slug,
            id: { not: id },
          },
        })
        counter++
      }
    }

    // Handle publishedAt
    let publishedAt = existingPost.publishedAt
    if (validatedData.publishedAt) {
      publishedAt = new Date(validatedData.publishedAt)
    } else if (validatedData.isPublished && !existingPost.isPublished) {
      // Auto-set publishedAt when publishing for the first time
      publishedAt = new Date()
    } else if (!validatedData.isPublished) {
      publishedAt = null
    }

    // Delete old image if changed
    if (existingPost.imageUrl && validatedData.imageUrl !== existingPost.imageUrl) {
      await deleteImageFile(existingPost.imageUrl)
    }

    // Update post
    const post = await prisma.blogPost.update({
      where: { id },
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

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error updating blog post:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Greška pri ažuriranju blog posta" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju" },
        { status: 403 }
      )
    }

    // Get post
    const post = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Blog post nije pronađen" },
        { status: 404 }
      )
    }

    // Delete image file if exists
    if (post.imageUrl) {
      await deleteImageFile(post.imageUrl)
    }

    // Delete post
    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      { error: "Greška pri brisanju blog posta" },
      { status: 500 }
    )
  }
}
