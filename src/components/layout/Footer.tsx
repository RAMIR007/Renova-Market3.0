import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { LogoWithText } from '@/components/common/Logo';

export function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            <LogoWithText variant="adaptive" />
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Tu tienda de confianza para moda sostenible en Cuba. Encuentra piezas únicas y dale una segunda vida al estilo.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Comprar</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="/shop" className="hover:text-blue-600 transition-colors">Novedades</Link></li>
                            <li><Link href="/shop?category=ropa" className="hover:text-blue-600 transition-colors">Ropa</Link></li>
                            <li><Link href="/shop?category=zapatos" className="hover:text-blue-600 transition-colors">Zapatos</Link></li>
                            <li><Link href="/shop?sort=price_asc" className="hover:text-blue-600 transition-colors">Ofertas</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Empresa</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="/about" className="hover:text-blue-600 transition-colors">Sobre Nosotros</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contacto</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Términos y Condiciones</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacidad</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Síguenos</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-white dark:bg-zinc-800 rounded-full text-gray-500 hover:text-blue-600 hover:shadow-md transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white dark:bg-zinc-800 rounded-full text-gray-500 hover:text-pink-600 hover:shadow-md transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white dark:bg-zinc-800 rounded-full text-gray-500 hover:text-blue-400 hover:shadow-md transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                        <div className="mt-6">
                            <p className="text-xs text-gray-400 mb-2">Métodos de pago aceptados:</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700">
                                    💵 Efectivo
                                </span>
                                <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700">
                                    🏦 Transferencia
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Renova Market. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/admin" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
