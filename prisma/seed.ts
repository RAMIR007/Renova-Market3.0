import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
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
    const catSala = await prisma.category.create({
        data: {
            name: 'Sala',
            slug: 'sala',
            description: 'Muebles para tu sala de estar',
            image: '/images/categories/sala.jpg',
        },
    })

    const catComedor = await prisma.category.create({
        data: {
            name: 'Comedor',
            slug: 'comedor',
            description: 'Mesas y sillas para compartir',
            image: '/images/categories/comedor.jpg',
        },
    })

    const catDormitorio = await prisma.category.create({
        data: {
            name: 'Dormitorio',
            slug: 'dormitorio',
            description: 'Descanso y confort',
            image: '/images/categories/dormitorio.jpg',
        },
    })

    // 4. Create Products
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Sofá Modular Gris',
                slug: 'sofa-modular-gris',
                description: 'Sofá moderno y cómodo, ideal para espacios amplios.',
                price: 850.00,
                stock: 10,
                categoryId: catSala.id,
                images: ['/images/products/sofa1.jpg'],
                featured: true,
            }
        }),
        prisma.product.create({
            data: {
                name: 'Mesa de Centro Madera',
                slug: 'mesa-centro-madera',
                description: 'Mesa de centro minimalista en madera de roble.',
                price: 220.00,
                stock: 15,
                categoryId: catSala.id,
                images: ['/images/products/mesa1.jpg'],
            }
        }),
        prisma.product.create({
            data: {
                name: 'Comedor 6 Sillas',
                slug: 'comedor-6-sillas',
                description: 'Juego de comedor elegante.',
                price: 1200.00,
                compareAtPrice: 1500.00,
                stock: 5,
                categoryId: catComedor.id,
                images: ['/images/products/comedor1.jpg'],
                featured: true,
            }
        }),
        prisma.product.create({
            data: {
                name: 'Cama King Size',
                slug: 'cama-king-size',
                description: 'Cama tapizada con cabecera alta.',
                price: 950.00,
                stock: 8,
                categoryId: catDormitorio.id,
                images: ['/images/products/cama1.jpg'],
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
            total: 1070.00,
            customerName: 'Juan Pérez',
            customerEmail: 'juan@example.com',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            items: {
                create: [
                    {
                        productId: products[0].id,
                        quantity: 1,
                        price: 850.00
                    },
                    {
                        productId: products[1].id,
                        quantity: 1,
                        price: 220.00
                    }
                ]
            }
        }
    })

    await prisma.order.create({
        data: {
            status: 'DELIVERED',
            total: 1200.00,
            customerName: 'Maria Garcia',
            customerEmail: 'maria@example.com',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            items: {
                create: [
                    {
                        productId: products[2].id,
                        quantity: 1,
                        price: 1200.00
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
