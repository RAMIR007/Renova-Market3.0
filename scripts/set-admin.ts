import { PrismaClient } from '@prisma/client';

// Bypass the shared instance with pg adapter to avoid SSL issues in script execution.
// We explicitly set the datasource URL because the schema might be relying on the adapter.
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

async function main() {
    const email = 'admin@renova.cu';
    const newPassword = 'Renova2025';

    console.log(`Conectando a BD...`);

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        console.log(`El usuario ${email} ya existe. Actualizando contraseña...`);
        await prisma.user.update({
            where: { email },
            data: {
                password: newPassword,
                role: 'ADMIN'
            }
        });
    } else {
        console.log(`Creando nuevo super-administrador: ${email}`);
        await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: email,
                password: newPassword,
                role: 'ADMIN'
            }
        });
    }

    console.log("¡Éxito! 🚀");
    console.log(`Usuario: ${email}`);
    console.log(`Contraseña: ${newPassword}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
