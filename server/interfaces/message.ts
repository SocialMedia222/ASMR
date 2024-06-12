
import { Document } from "mongoose";
interface IMessage extends Document {
    id: string;
    name: string;
    recipient: string;
    text: string;
    seenBy: string[];
    timestamp: Date;
}

