import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret'
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    })

                    if (user && user.password === credentials.password) {
                        return {
                            id: user.id.toString(),
                            email: user.email,
                            name: user.name,
                            role: user.role
                        }
                    }
                    return null
                } catch (error) {
                    console.error('Auth error:', error)
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: '/signin',
        signUp: '/signup'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role
                session.user.id = token.id
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
    session: {
        strategy: 'jwt'
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }