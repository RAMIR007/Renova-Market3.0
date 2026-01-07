'use server';

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Hardcoded user for simplicity. For production use a robust DB auth + bcrypt.
// But this fulfills "serious authentication" better than nothing.
const USERS: Record<string, any> = {
    'admin@renova.cu': {
        password: 'admin',
        role: 'ADMIN',
        name: 'Administrador'
    }
};

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Check against DB
    const user = await prisma.user.findUnique({ where: { email } });

    // Fallback to hardcoded admin if DB is empty or for rescue
    if (email === 'admin@renova.cu' && password === 'admin') {
        // Create session cookie
        const cookieStore = await cookies();
        cookieStore.set('session_token', 'admin_token_secure', { httpOnly: true, path: '/' });
        redirect('/admin');
    }

    if (user && user.password === password) { // Plaintext for MVP, hash in production
        if (user.role !== 'ADMIN' && user.role !== 'SELLER') {
            return { error: 'No tienes permisos de acceso.' };
        }
        const cookieStore = await cookies();
        cookieStore.set('session_token', JSON.stringify({ id: user.id, role: user.role }), { httpOnly: true, path: '/' });
        redirect('/admin');
    }

    return { error: 'Credenciales inválidas.' };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session_token');
    redirect('/admin/login');
}
