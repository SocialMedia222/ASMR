import { Document } from 'mongoose';

export interface ILike extends Document {
  _id: string;
  userId: string; // User ID
  postId?: string; // Post ID
  commentId?: string; // Comment ID
  createdAt: Date;
}
