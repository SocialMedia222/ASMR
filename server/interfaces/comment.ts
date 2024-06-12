import { Document } from 'mongoose';

export interface IComment extends Document {
  _id: string;
  postId: string; // Post ID
  author: string; // User ID
  content: string;
  likes: string[]; // Array of User IDs
  createdAt: Date;
  updatedAt: Date;
}
