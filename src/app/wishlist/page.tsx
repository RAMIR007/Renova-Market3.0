import { getFavoriteProducts } from "@/actions/favorites";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";

export default async function WishlistPage() {
    const products = await getFavoriteProducts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8">Mi Lista de Deseos ❤️</h1>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <p className="text-xl text-gray-500 mb-6">Aún no has guardado nada.</p>
                    <Link
                        href="/shop"
                        className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                        Explorar Tienda
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 row-gap-10">
                    {products.map((product) => (
                        <div key={product.id} className="h-full">
                            {/* @ts-ignore - ProductCard types might be strict but data is compatible */}
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
