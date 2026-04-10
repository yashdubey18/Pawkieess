import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let isConnected = false;
let mongoServer = null;

const connectDB = async () => {
    try {
        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);

        try {
            console.log('Attempting to connect to remote MongoDB...');
            const conn = await mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000, // Reduced to fail faster
                socketTimeoutMS: 45000,
                family: 4 // Use IPv4, skip trying IPv6
            });

            isConnected = true;
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        } catch (initialError) {
            console.error(`❌ Remote MongoDB Connection Error: ${initialError.message}`);
            console.log('⚠️ Falling back to in-memory MongoDB for development...');
            
            mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            
            const conn = await mongoose.connect(mongoUri);
            isConnected = true;
            console.log(`✅ In-Memory MongoDB Connected at: ${mongoUri}`);
            console.log('⚠️ NOTE: Data stored in this memory database will be lost when the server restarts.');
        }

        // Handle disconnection
        mongoose.connection.on('disconnected', () => {
            isConnected = false;
            console.log('❌ MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('error', (err) => {
            isConnected = false;
            console.error('❌ MongoDB connection error:', err.message);
        });

    } catch (error) {
        isConnected = false;
        console.error(`❌ Complete MongoDB Failure: ${error.message}`);
        console.log('⚠️  Server will run without database.');
    }
};

// Helper function to check if DB is connected
export const isDBConnected = () => isConnected;

export default connectDB;
