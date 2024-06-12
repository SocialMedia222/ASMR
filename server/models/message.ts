import { Schema, model, Model } from 'mongoose';
export interface IMessage{
    id: string;
    name: string;
    recipient: string;
    text: string;
    seenBy: string[];
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    recipient: { type: String, required: true },
    text: { type: String, required: true },
    seenBy: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now },
});

const Message: Model<IMessage> = model<IMessage>('Message', messageSchema);

export default Message;