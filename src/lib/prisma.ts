import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prismaClientSingleton = () => {
    // Ensure SSL for Neon
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('sslmode=')) {
        process.env.DATABASE_URL += (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'sslmode=require'
    }
    return new PrismaClient()
}

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
