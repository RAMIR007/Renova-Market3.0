import Image from 'next/image';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-white dark:bg-zinc-900 min-h-screen">
            {/* Hero */}
            <div className="relative h-[400px] w-full bg-gray-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-5xl font-bold mb-4">Sobre Nosotros</h1>
                    <p className="text-xl max-w-2xl mx-auto text-gray-200">
                        Redefiniendo la moda sostenible en Cuba, una prenda a la vez.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nuestra Historia</h2>
                        <div className="prose dark:prose-invert text-gray-600 dark:text-gray-400">
                            <p>
                                Renova Market nació con una misión simple: dar una segunda vida a prendas excepcionales.
                                Creemos que el estilo no debe estar reñido con la sostenibilidad.
                            </p>
                            <p>
                                Seleccionamos cuidadosamente cada pieza de nuestra colección, asegurando calidad,
                                estilo y accesibilidad para todos nuestros clientes en La Habana.
                            </p>
                        </div>

                        <div className="pt-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Ubicación y Contacto</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">San Francisco de Paula</p>
                                        <p className="text-gray-500">San Miguel del Padrón, La Habana, Cuba</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                        <Image
                            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop"
                            alt="Nuestro equipo"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
