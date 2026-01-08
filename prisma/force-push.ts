
import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

let url = process.env.DATABASE_URL;

if (!url) {
    console.error("No DATABASE_URL");
    process.exit(1);
}

// Add connection timeout to help with flaky networks
if (!url.includes('connect_timeout')) {
    url += '&connect_timeout=60';
}
// Ensure SSL
if (!url.includes('sslmode')) {
    url += '&sslmode=require';
}

console.log("🚀 Attempting to push with enhanced connection string...");

const cmd = `npx prisma db push --accept-data-loss`; // CAREFUL: We accept data loss because we just cleaned the DB anyway.

const child = exec(cmd, {
    env: {
        ...process.env,
        DATABASE_URL: url
    }
});

child.stdout?.pipe(process.stdout);
child.stderr?.pipe(process.stderr);

child.on('exit', (code) => {
    console.log(`Prisma process exited with code ${code}`);
    process.exit(code || 0);
});
