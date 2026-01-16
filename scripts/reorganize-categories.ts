
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const isProduction = process.env.NODE_ENV === 'production'

async function main() {
    console.log('Starting category reorganization...')

    if (!connectionString) {
        console.error('DATABASE_URL is not defined')
        process.exit(1)
    }

    // Use the same adapter strategy as the application
    const pool = new Pool({
        connectionString,
        // Only enforce strict SSL in production if needed, or rely on drivers defaults.
        // In this project context, it seems to require SSL.
        ssl: isProduction ? true : { rejectUnauthorized: false }
    })

    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
        // 1. Ensure "Ropa" category exists
        const ropa = await prisma.category.upsert({
            where: { name: 'Ropa' },
            update: {},
            create: {
                name: 'Ropa',
                slug: 'ropa',
                description: 'Categoría principal de ropa',
            },
        })
        console.log(`Parent Category 'Ropa' ensured (ID: ${ropa.id})`)

        // 2. Update/Create "Abrigos" as child of "Ropa"
        // Use upsert to handle both creation and update of existing
        const abrigos = await prisma.category.upsert({
            where: { name: 'Abrigos' },
            update: { parentId: ropa.id },
            create: {
                name: 'Abrigos',
                slug: 'abrigos',
                description: 'Abrigos y chaquetas',
                parentId: ropa.id,
            },
        })
        console.log(`Category 'Abrigos' updated with parent 'Ropa'`)

        // 3. Update/Create "Monos" as child of "Ropa"
        const monos = await prisma.category.upsert({
            where: { name: 'Monos' },
            update: { parentId: ropa.id },
            create: {
                name: 'Monos',
                slug: 'monos',
                description: 'Monos y enterizos',
                parentId: ropa.id,
            },
        })
        console.log(`Category 'Monos' updated with parent 'Ropa'`)

    } catch (error) {
        console.error('Error organizing categories:', error)
        // Don't exit with 1 if it's just a connection error during build to avoid failing the whole build 
        // IF the user wants the build to succeed even if this script fails (e.g. if DB is unreachable).
        // However, usually detailed logs are better.
        process.exit(1)
    } finally {
        await prisma.$disconnect()
        await pool.end()
    }
}

main()
