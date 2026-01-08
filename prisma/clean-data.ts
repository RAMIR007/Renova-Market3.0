
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ No DATABASE_URL found.");
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: true, // Assuming production-like environment with SSL required
});

async function clean() {
    console.log('🧹 Limpiando base de datos (SQL Directo)...');
    await client.connect();

    try {
        // Disable triggers/constraints if needed? 
        // Ideally respecting FK order is safer.

        // 1. OrderItem (Child of Order and Product)
        console.log(' - Eliminando OrderItem...');
        await client.query('DELETE FROM "OrderItem"');

        // 2. Order (Has User)
        console.log(' - Eliminando Order...');
        await client.query('DELETE FROM "Order"');

        // 3. Product (Has Category)
        console.log(' - Eliminando Product...');
        await client.query('DELETE FROM "Product"');

        // 4. Address (Has User)
        console.log(' - Eliminando Address...');
        await client.query('DELETE FROM "Address"');

        // 5. Analytics
        console.log(' - Eliminando VisitLog...');
        await client.query('DELETE FROM "VisitLog"');

        console.log(' - Eliminando DailyStat...');
        await client.query('DELETE FROM "DailyStat"');

        // 6. User (Last)
        console.log(' - Eliminando User...');
        await client.query('DELETE FROM "User"');

        console.log('✅ Base de datos limpia (Categorías conservadas).');

    } catch (err) {
        console.error("Error durante limpieza SQL:", err);
        throw err;
    } finally {
        await client.end();
    }
}

clean().catch(() => process.exit(1));
