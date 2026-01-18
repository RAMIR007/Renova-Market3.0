import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";

// export const revalidate = 3600; // Update every hour (ISR)
export const dynamic = 'force-dynamic'; // Temporary fix for build-time DB connection issues

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Renova Market | Moda Circular y Sostenible en Cuba",
  description: "Descubre moda exclusiva y piezas únicas en La Habana. Compra marcas top y renueva tu estilo con entrega rápida.",
  openGraph: {
    title: "🔥 Renova Market: Moda Exclusiva en Cuba", // Ad-like title
    description: "¡Encuentra tesoros únicos! Ropa de marcas, precios increíbles y entrega a domicilio. Entra y explora la colección.",
    images: ["https://images.unsplash.com/photo-1534008779836-3a5fe61ce049?q=80&w=1200"], // Use Hero image
    type: "website",
    locale: "es_CU",
    siteName: "Renova Market"
  },
  alternates: {
    canonical: 'https://renovamarket.com',
  }
};

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
      include: {
        products: {
          take: 1,
          select: { images: true }
        }
      }
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
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <div className="mt-16 md:mt-20"> {/* Spacer for fixed navbar */}
        <Stories />
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[95vh] min-h-[600px] flex items-center justify-start overflow-hidden bg-stone-900">
        {/* Background Image with modern overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1534008779836-3a5fe61ce049?q=80&w=2070&auto=format&fit=crop"
            alt="Moda Única en La Habana"
            fill
            priority
            className="object-cover object-center grayscale-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100/10 backdrop-blur-md border border-stone-200/20 text-stone-100 text-sm font-semibold tracking-wide mb-8 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-200 animate-pulse" />
              COLECCIÓN HABANA 2026
            </div>

            <h1 className="text-4xl min-[400px]:text-5xl sm:text-7xl lg:text-8xl font-black text-stone-100 tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
              ESENCIA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-100 to-amber-200 bg-[length:200%_auto] animate-gradient">
                ÚNICA
              </span>
            </h1>

            <p className="text-lg sm:text-2xl text-stone-200 mb-10 max-w-xl font-light leading-relaxed drop-shadow-md">
              Moda exclusiva inspirada en el alma de La Habana. Encuentra piezas seleccionadas que cuentan tu propia historia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-stone-100 text-stone-900 font-bold rounded-full overflow-hidden transition-transform active:scale-95 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-stone-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  Ver Catálogo
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
              </Link>

              <Link
                href="/about"
                className="hidden" // Hiding the old button temporarily or removing it implies easier diff
              />
              <Link
                href="#categories"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-stone-100 border border-stone-200/30 hover:bg-stone-100/10 backdrop-blur-md transition-colors text-lg"
              >
                Explorar Categorías
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="bg-stone-900 text-stone-100 py-12 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-800">
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2 text-amber-100">💎 Calidad Premium</h3>
            <p className="text-stone-400">Selección curada de las mejores marcas y estados.</p>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2 text-amber-100">🌿 100% Sostenible</h3>
            <p className="text-stone-400">Dale una segunda vida a la moda y cuida el planeta.</p>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2 text-amber-100">🚀 Envíos en La Habana</h3>
            <p className="text-stone-400">Entrega rápida y segura a todos los municipios.</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Categorías Populares</h2>
          <p className="text-stone-600 dark:text-stone-400">Todo lo que necesitas para completar tu outfit</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category: any) => {
            // 1. Manually set image
            let imageUrl = category.image;

            // 2. Keyword-based fallback (Prioritize generics for specific categories)
            if (!imageUrl) {
              const lowerName = category.name.toLowerCase();
              if (lowerName.includes('abrigo') || lowerName.includes('chaqueta')) {
                imageUrl = 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=2000&auto=format&fit=crop';
              } else if (lowerName.includes('mono') || lowerName.includes('jumpsuit')) {
                imageUrl = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2000&auto=format&fit=crop';
              }
            }

            // 3. Automatic fallback from first product
            if (!imageUrl && category.products?.length > 0 && category.products[0].images?.length > 0) {
              imageUrl = category.products[0].images[0];
            }

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative h-80 overflow-hidden rounded-2xl shadow-md cursor-pointer"
              >
                {imageUrl ? (
                  <div className="absolute inset-0 bg-stone-200">
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-stone-200 dark:from-stone-800 dark:to-stone-700" />
                )}

                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                  <p className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                    Explorar
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white dark:bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Destacados</h2>
              <p className="text-stone-600 dark:text-stone-400">Nuestros productos favoritos del mes</p>
            </div>
            <Link href="/shop" className="text-stone-900 dark:text-stone-100 font-medium hover:underline hidden sm:block decoration-2 underline-offset-4 decoration-amber-400">
              Ver todo &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 gap-y-8 sm:gap-y-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link href="/shop" className="inline-block border border-stone-300 px-6 py-3 rounded-full text-sm font-medium hover:bg-stone-50 transition-colors">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Teaser */}
      <section className="py-20 bg-stone-900 text-stone-100 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para renovar tu look?</h2>
        <p className="text-stone-400 max-w-2xl mx-auto mb-8 text-lg">
          Descubre las últimas tendencias y encuentra tu estilo único.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-amber-100 text-stone-900 px-8 py-3 rounded-full font-bold hover:bg-white transition-colors"
        >
          Ir a la Tienda
        </Link>
      </section>
    </div>
  );
}
