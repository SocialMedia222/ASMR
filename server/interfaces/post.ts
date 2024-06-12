import { Document } from 'mongoose';

export interface IPost extends Document {
  _id: string;
  author: string; // User ID
  content: string;
  image?: string;
  likes: string[]; // Array of User IDs
  comments: string[]; // Array of Comment IDs
  createdAt: Date;
  updatedAt: Date;
}
