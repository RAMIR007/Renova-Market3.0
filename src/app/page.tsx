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
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2069&auto=format&fit=crop"
            alt="Moda con Alegría"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-gray-900/10" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-in fade-in zoom-in duration-700">
          <span className="inline-block py-1 px-4 rounded-full bg-yellow-400/20 backdrop-blur-md border border-yellow-400/30 text-xs md:text-sm font-bold tracking-wider mb-8 uppercase text-yellow-300">
            👋 ¡Hola! Bienvenido a tu nuevo estilo
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 drop-shadow-2xl text-white">
            DA VIDA A <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500">TU MEJOR VERSIÓN</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide drop-shadow-md">
            Ropa increíble, precios justos y buena vibra. <br className="hidden md:block" /> Encuentra esa prenda única que te hará sonreír.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Ver Colección
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg border border-white/30 bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all text-white"
            >
              Nuestra Historia
            </Link>
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
