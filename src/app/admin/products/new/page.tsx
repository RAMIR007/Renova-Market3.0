import { prisma } from "@/lib/prisma";
import NewProductForm from "./form";
import { cookies } from "next/headers";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    // Check role
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    let role = 'SELLER'; // Default to restricted view

    if (token) {
        if (token === 'admin_token_secure') {
            role = 'ADMIN';
        } else {
            try {
                const session = JSON.parse(token);
                role = session.role || 'SELLER';
            } catch (e) {
                // if parse fails, assume safe default
            }
        }
    }

    return <NewProductForm categories={categories} userRole={role} />;
}
