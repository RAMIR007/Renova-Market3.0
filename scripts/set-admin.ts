import { prisma } from "@/lib/prisma";

async function main() {
    const email = 'admin@renova.cu';
    const newPassword = 'tu_nueva_clave_secreta'; // ¡CÁMBIAME ANTES DE EJECUTAR!

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        console.log(`El usuario ${email} ya existe. Actualizando contraseña...`);
        await prisma.user.update({
            where: { email },
            data: {
                password: newPassword, // En un sistema real, ¡hashea esto!
                role: 'ADMIN'
            }
        });
    } else {
        console.log(`Creando nuevo super-administrador: ${email}`);
        await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: email,
                password: newPassword, // En un sistema real, ¡hashea esto!
                role: 'ADMIN'
            }
        });
    }

    console.log("¡Listo! Ahora puedes loguearte con la nueva credencial.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
