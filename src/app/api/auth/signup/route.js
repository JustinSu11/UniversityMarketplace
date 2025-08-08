import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { signJWT } from '@/lib/auth';
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    // 1. Validate input
    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json({ error: 'Name, email, password, and phone number are required' }, { status: 400 });
    }

    if (password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // 2. Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 }) // 409 Conflict
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    })

    // return response without password hash
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 })
  }
}
