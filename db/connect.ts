import mongoose from "npm:mongoose@^6.7";
import dotenv from "npm:dotenv@^16.0";
import process from "node:process";

dotenv.config();

export async function connectDB() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in the environment variables");
        }
        await mongoose.connect(mongoUri);
        console.log("Conectado ao MongoDB");
    } catch (error) {
        console.error("Erro na conexão:", error);
    }
}