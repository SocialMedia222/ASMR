import mongoose from 'mongoose';
import dotenv from "dotenv"

dotenv.config();

// mongoose.connect(process.env.MONGODB_URL)
//     .then(() => { console.log("Database Connected!"); })
//     .catch(() => { console.log("Error while connecting to database"); })

export function connect() {
    // eslint-disable-next-line no-undef
    return mongoose.connect(process.env.MONGO_URI);
}
