import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";

export const revalidate = 3600; // Update every hour (ISR)



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

import { Stories } from "@/components/shop/Stories";

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      <div className="mt-16 md:mt-20"> {/* Spacer for fixed navbar */}
        <Stories />
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[95vh] min-h-[600px] flex items-center justify-start overflow-hidden bg-gray-900">
        {/* Background Image with modern overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
            alt="Nueva Colección Renova"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold tracking-wide mb-8 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              NUEVA TEMPORADA 2026
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
              DEFINE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-400 bg-[length:200%_auto] animate-gradient">
                TU ESTILO
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-200 mb-10 max-w-xl font-light leading-relaxed drop-shadow-md">
              Explora una colección donde la elegancia se encuentra con la sostenibilidad. Piezas únicas para gente auténtica.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform active:scale-95 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  Ver Colección
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white border border-white/30 hover:bg-white/10 backdrop-blur-md transition-colors text-lg"
              >
                Nuestra Historia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="bg-black text-white py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2">💎 Calidad Premium</h3>
            <p className="text-gray-400">Selección curada de las mejores marcas y estados.</p>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2">🌿 100% Sostenible</h3>
            <p className="text-gray-400">Dale una segunda vida a la moda y cuida el planeta.</p>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2">🚀 Envíos en La Habana</h3>
            <p className="text-gray-400">Entrega rápida y segura a todos los municipios.</p>
          </div>
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
                  <Image
                    src={category.image || '/images/placeholder.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
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
      <section className="py-24 bg-white dark:bg-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Destacados</h2>
              <p className="text-gray-600 dark:text-gray-400">Nuestros productos favoritos del mes</p>
            </div>
            <Link href="/shop" className="text-black dark:text-white font-medium hover:underline hidden sm:block decoration-2 underline-offset-4">
              Ver todo &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link href="/shop" className="inline-block border border-gray-300 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
              Ver todos los productos
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
