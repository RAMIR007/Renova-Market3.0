# Plan de Mentoría: E-commerce Profesional para Cuba 🇨🇺

Este documento detalla el plan de trabajo para convertir "Renova Market" en una tienda online optimizada para el contexto cubano (baja conectividad, datos móviles inestables), siguiendo las mejores prácticas de Next.js, Prisma y Neon.

## Estado Actual
- **Stack:** Next.js 16 (App Router), Prisma, Postgres (Neon), TypeScript.
- **Base de Datos:** Configurada con productos básicos.
- **Faltantes Críticos:** Configuración PWA (Offline-first), ISR (Rendimiento), Lógica de Pieza Única, Email/PDF.

---

## Paso 1: Configuración del Entorno y Arquitectura (Offline-First) 🧱
El objetivo es que la web cargue instantáneamente y funcione incluso si se va la conexión momentáneamente.

- [x] **Configurar PWA (Progressive Web App):**
    - [x] Implementar `next-pwa` en `next.config.ts`.
    - [x] Crear `manifest.json` con iconos y colores de marca.
    - [x] Configurar Service Workers para cachear recursos estáticos (imágenes, CSS, JS).
- [x] **Limpieza de "force-dynamic":**
    - [x] Eliminar `export const dynamic = 'force-dynamic'` de `src/app/page.tsx` y otras páginas públicas.
    - [ ] Reemplazar con estrategias de ISR (Incremental Static Regeneration).

## Paso 2: Modelado de Datos Avanzado (Prisma & Neon) 🗄️
Adaptaremos la base de datos para vender ropa de segunda mano (piezas únicas) y controlar el inventario rigurosamente.

- [x] **Refinar Esquema de Prisma (`schema.prisma`):**
    - [x] Agregar campos para "Pieza Única": `talla` (String), `color` (String), `condicion` (Enum: NUEVO, EXCELENTE, BUENO).
    - [x] Asegurar que el manejo de `stock` soporte la lógica de "1 item único" (Default 1).
    - [x] Agregar relaciones para manejo de direcciones de envío (crucial para delivery en Cuba).

## Paso 3: Catálogo y Optimización (Rendimiento Extremo) 🚀
Mejorar la velocidad de carga para ahorrar datos móviles a los usuarios.

- [x] **Implementar ISR (Revalidación):**
    - [x] Configurar `revalidate` en `page.tsx` y páginas de producto (ej. actualizar cada 1 hora o 24 horas).
    - [x] Explicación: Servir HTML estático pre-generado en lugar de calcularlo en cada visita.
- [x] **Optimización de Imágenes:**
    - [x] Asegurar uso correcto de `<Image />` component de Next.js.
    - [x] Definir tamaños (`sizes` prop) para móviles vs escritorio.

## Paso 4: Admin Panel y Lógica de Negocio 💼
Gestión robusta del inventario y prevención de errores en ventas.

- [ ] **Panel de Administración (`/admin`):**
    - [ ] Crear Server Actions para: Crear, Editar, Eliminar productos.
    - [ ] Implementar subida de imágenes (actualmente simulada, evaluar Cloudinary free tier si es viable o mantener assets locales optimizados).
- [ ] **Lógica de "Sistema de Apartado" (Concurrency):**
    - [ ] Implementar chequeo de stock atómico con Prisma antes de confirmar orden.
    - [ ] Evitar que dos personas compren el mismo par de zapatos únicos al mismo tiempo.

## Paso 5: Experiencia Post-Venta (Emails y PDF) 📧
Confirmación profesional sin costo recurrente.

- [ ] **Integración con Resend (Email):**
    - [ ] Configurar cuenta y API Key.
    - [ ] Crear template de email de confirmación de compra (React Email).
    - [ ] Server Action para enviar correo tras compra exitosa.
- [ ] **Generación de Vale PDF:**
    - [ ] Instalar `@react-pdf/renderer`.
    - [ ] Diseñar el documento PDF (Factura/Vale).
    - [ ] Generar y adjuntar el PDF al correo o permitir descarga directa.
