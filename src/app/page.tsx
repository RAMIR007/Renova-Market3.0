import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";



async function getCategories() {
  try {
    return await prisma.category.findMany({
      take: 3,
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Database Error (Categories):", error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { featured: true },
      take: 4,
      include: { category: true }
    });
  } catch (error) {
    console.error("Database Error (Products):", error);
    return [];
  }
}

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          {/* Placeholder for a hero background if we had one. For now just dark bg */}
          <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Renova Market
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Renueva tu estilo con nuestra colección exclusiva de ropa, zapatos y accesorios de temporada.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Ver Colección
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Categorías Populares</h2>
          <p className="text-gray-600 dark:text-gray-400">Todo lo que necesitas para completar tu outfit</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative h-80 overflow-hidden rounded-2xl shadow-md cursor-pointer"
            >
              {category.image ? (
                <div className="absolute inset-0 bg-gray-200">
                  {/* We use a simple div placeholder for images that might not exist locally yet to avoid broken img icons if files are missing */}
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                    IMG: {category.name}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900" />
              )}

              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                <p className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                  Explorar
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white dark:bg-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Destacados</h2>
              <p className="text-gray-600 dark:text-gray-400">Nuestros productos favoritos del mes</p>
            </div>
            <Link href="/shop" className="text-blue-600 dark:text-blue-400 hover:underline hidden sm:block">
              Ver todo &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group bg-gray-50 dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-zinc-800"
              >
                <div className="relative aspect-square bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
                  {/* Placeholder since we don't have real images yet */}
                  <span>{product.name}</span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                  <h3 className="font-semibold truncate group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-lg">${Number(product.price).toFixed(2)}</span>
                    {product.stock > 0 ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">En stock</span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Agotado</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/shop" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Ver todos los productos &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Teaser */}
      <section className="py-20 bg-gray-900 text-white text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para renovar tu look?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
          Descubre las últimas tendencias y encuentra tu estilo único.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
        >
          Ir a la Tienda
        </Link>
      </section>
    </div>
  );
}
