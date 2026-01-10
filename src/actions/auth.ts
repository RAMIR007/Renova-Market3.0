'use server';

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 1. Ensure Admin User exists in DB (Migration from hardcoded)
    if (email === 'admin@renova.cu') {
        const adminExists = await prisma.user.findUnique({ where: { email } });
        if (!adminExists) {
            // Create default admin if not exists
            const hashedPassword = await bcrypt.hash('admin', 10);
            await prisma.user.create({
                data: {
                    email: 'admin@renova.cu',
                    password: hashedPassword,
                    role: 'ADMIN',
                    name: 'Administrador'
                }
            });
        }
    }

    // 2. Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return { error: 'Credenciales inválidas.' };
    }

    // 3. Verify Password
    let passwordMatch = false;

    // Try bcrypt compare first
    // Note: If user.password is plaintext "admin", compare might fail or error depending on salt format.
    // Safe approach: Check if it looks like a hash (starts with $2), if not assume plaintext.
    const isHashed = user.password.startsWith('$2');

    if (isHashed) {
        passwordMatch = await bcrypt.compare(password, user.password);
    } else {
        // Fallback for legacy plaintext users
        if (user.password === password) {
            passwordMatch = true;
            // Auto-migrate to hash
            const newHash = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: newHash }
            });
        }
    }

    if (passwordMatch) {
        const cookieStore = await cookies();
        // Use the same session format
        cookieStore.set('session_token', JSON.stringify({ id: user.id, role: user.role, name: user.name }), { httpOnly: true, path: '/' });

        if (user.role === 'ADMIN' || user.role === 'SELLER') {
            redirect('/admin');
        } else {
            redirect('/');
        }
    }

    return { error: 'Credenciales inválidas.' };
}

export async function register(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const marketingOptIn = formData.get('marketingOptIn') === 'on';

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return { error: 'El correo electrónico ya está registrado.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: 'USER',
            marketingOptIn
        }
    });

    // Auto login
    const cookieStore = await cookies();
    cookieStore.set('session_token', JSON.stringify({ id: newUser.id, role: newUser.role, name: newUser.name }), { httpOnly: true, path: '/' });

    redirect('/');
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session_token');
    redirect('/login');
}
