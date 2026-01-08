
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function verifyAdminSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
        // Since server actions can't easily "redirect" in a way that breaks execution flow cleanly for the caller without throw,
        // we might return null or throw error.
        // For simplicity in this project's pattern: we'll return null or false.
        return null;
    }

    // Basic validation: Check if it's the hardcoded admin or a valid JSON session
    // In a real app we'd verify JWT signature here
    if (token === 'admin_token_secure') {
        return { role: 'ADMIN', id: 'hardcoded-admin' };
    }

    try {
        const session = JSON.parse(token);
        if (session.role === 'ADMIN' || session.role === 'SELLER') {
            return session;
        }
    } catch (e) {
        return null;
    }

    return null;
}

export async function requireAdmin() {
    const session = await verifyAdminSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SELLER')) {
        // Allowing SELLERS to perform most "admin" actions for now based on project scope
        // strictly speaking "Admin" implies role=ADMIN, but sellers need access to products.
        // Let's refine: 
        throw new Error("No autorizado");
    }
    return session;
}
