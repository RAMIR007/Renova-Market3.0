import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString,
    ssl: true,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Start seeding ...')

    // 1. Clean existing data
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
    await prisma.dailyStat.deleteMany()

    // 2. Create Users (Admin)
    const admin = await prisma.user.create({
        data: {
            email: 'admin@renova.com',
            name: 'Admin Renova',
            password: 'hashed_password_here', // In production use bcrypt
            role: 'ADMIN',
        },
    })

    // 3. Create Categories
    const catRopa = await prisma.category.create({
        data: {
            name: 'Ropa',
            slug: 'ropa',
            description: 'Tendencias y moda para toda ocasión',
            image: '/images/categories/ropa.jpg',
        },
    })

    const catZapatos = await prisma.category.create({
        data: {
            name: 'Zapatos',
            slug: 'zapatos',
            description: 'Calzado cómodo y con estilo',
            image: '/images/categories/zapatos.jpg',
        },
    })

    const catCarteras = await prisma.category.create({
        data: {
            name: 'Carteras',
            slug: 'carteras',
            description: 'El complemento perfecto para tu look',
            image: '/images/categories/carteras.jpg',
        },
    })

    // 4. Create Products
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Vestido Floral Verano',
                slug: 'vestido-floral-verano',
                description: 'Vestido ligero con estampado floral, ideal para días soleados.',
                price: 45.00,
                stock: 1, // Pieza única
                categoryId: catRopa.id,
                images: ['/images/products/vestido1.jpg'],
                featured: true,
                size: 'M',
                color: 'Multicolor',
                condition: 'NUEVO'
            }
        }),
        prisma.product.create({
            data: {
                name: 'Jeans Slim Fit',
                slug: 'jeans-slim-fit',
                description: 'Jeans de corte ajustado y tela elástica para mayor comodidad.',
                price: 35.00,
                stock: 1,
                categoryId: catRopa.id,
                images: ['/images/products/jeans1.jpg'],
                size: '32',
                color: 'Azul',
                condition: 'EXCELENTE'
            }
        }),
        prisma.product.create({
            data: {
                name: 'Zapatillas Urbanas',
                slug: 'zapatillas-urbanas',
                description: 'Zapatillas deportivas con diseño moderno.',
                price: 65.00,
                compareAtPrice: 80.00,
                stock: 1,
                categoryId: catZapatos.id,
                images: ['/images/products/zapatillas1.jpg'],
                featured: true,
                size: '42',
                color: 'Azul/Naranja',
                condition: 'NUEVO'
            }
        }),
        prisma.product.create({
            data: {
                name: 'Bolso de Cuero Negro',
                slug: 'bolso-cuero-negro',
                description: 'Bolso elegante de cuero sintético con compartimentos.',
                price: 55.00,
                stock: 1,
                categoryId: catCarteras.id,
                images: ['/images/products/bolso1.jpg'],
                size: 'Única',
                color: 'Negro',
                condition: 'EXCELENTE'
            }
        })
    ])

    // 5. Create Stats (Fake Analytics)
    const today = new Date()
    await prisma.dailyStat.create({
        data: {
            date: today,
            views: 145,
            visitors: 89,
        }
    })

    // 6. Create Fake Orders
    await prisma.order.create({
        data: {
            status: 'PROCESSING',
            total: 80.00,
            customerName: 'Juan Pérez',
            customerEmail: 'juan@example.com',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            items: {
                create: [
                    {
                        productId: products[0].id,
                        quantity: 1,
                        price: 45.00
                    },
                    {
                        productId: products[1].id,
                        quantity: 1,
                        price: 35.00
                    }
                ]
            }
        }
    })

    await prisma.order.create({
        data: {
            status: 'DELIVERED',
            total: 65.00,
            customerName: 'Maria Garcia',
            customerEmail: 'maria@example.com',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            items: {
                create: [
                    {
                        productId: products[2].id,
                        quantity: 1,
                        price: 65.00
                    }
                ]
            }
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
