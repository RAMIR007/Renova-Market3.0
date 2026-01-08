import Image from 'next/image';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-white dark:bg-zinc-900 min-h-screen">
            {/* Hero */}
            <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
                        alt="About Hero"
                        fill
                        className="object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                </div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-in fade-in zoom-in duration-700">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide mb-4">
                        EST. 2024
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">SOBRE NOSOTROS</h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed">
                        Redefiniendo la moda sostenible en Cuba.<br /> Calidad, estilo y conciencia en cada prenda.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nuestra Historia</h2>
                            <div className="w-20 h-1 bg-black dark:bg-white rounded-full mb-6"></div>
                        </div>
                        <div className="prose dark:prose-invert text-gray-600 dark:text-gray-400 text-lg leading-relaxed space-y-4">
                            <p>
                                <strong>Renova Market</strong> no es solo una tienda, es un movimiento. Nacimos en el corazón de La Habana con una misión clara: demostrar que la moda de segunda mano puede ser tan exclusiva y emocionante como la nueva.
                            </p>
                            <p>
                                En un mundo de moda rápida, apostamos por la <strong>calidad duradera</strong>. Cada pieza en nuestro catálogo es seleccionada a mano, inspeccionada meticulosamente y preparada para comenzar su nueva historia contigo.
                            </p>
                            <p>
                                Nos enorgullece servir a nuestra comunidad en <strong>San Miguel del Padrón</strong> y conectar con amantes de la moda en toda la capital.
                            </p>
                        </div>

                        <div className="pt-4 grid grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                <h3 className="font-bold text-2xl text-indigo-600 mb-1">500+</h3>
                                <p className="text-sm text-gray-500">Clientes Felices</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                <h3 className="font-bold text-2xl text-emerald-600 mb-1">100%</h3>
                                <p className="text-sm text-gray-500">Satisfacción</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop"
                            alt="Nuestro equipo y tienda"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                            <p className="text-white font-medium">Nuestro compromiso es contigo.</p>
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Visítanos & Contáctanos</h2>
                        <p className="text-gray-500">Estamos más cerca de lo que crees.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Ubicación Principal</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        San Francisco de Paula<br />
                                        San Miguel del Padrón<br />
                                        La Habana, Cuba
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">WhatsApp & Teléfono</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        +53 5 XXX XXXX <span className="text-xs text-blue-500">(Disponible 24/7)</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Correo Electrónico</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        contacto@renova.cu
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Map Embed */}
                        <div className="h-[300px] md:h-full min-h-[300px] bg-gray-200 rounded-xl overflow-hidden shadow-inner relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58886.7877292215!2d-82.3559798!3d23.0583315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88cd723652de65b7%3A0x7090333066378a0!2sSan%20Francisco%20de%20Paula%2C%20Havana!5e0!3m2!1sen!2scu!4v1716300000000!5m2!1sen!2scu"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
