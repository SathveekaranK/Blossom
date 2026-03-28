import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

// Construct the URL exactly as Prisma needs it
const url = `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url,
        },
    },
});

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log(` MySQL Database Connected Successfully (${dbName} at ${dbHost})`);
    } catch (error) {
        console.error(' Database connection failed:', error);
        process.exit(1);
    }
};
