import mongoose from "mongoose";
import envConfig from "./envConfig";

const connection = {
    isConnected: 0,
};

async function dbConnect() {
    if(connection.isConnected) {
        console.log("Already Connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(envConfig.dbURI || '');
        connection.isConnected = db.connections[0].readyState;

        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("DB Connection Failed", error);
        process.exit(1);
    }
};

export default dbConnect;