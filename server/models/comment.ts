import { Schema, model, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IComment {
  _id: string;
  postId: string; // Post ID
  author: string; // User ID
  content: string;
  likes: string[]; // Array of User IDs
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    postId: {
      type: String,
      ref: 'Post',
      required: true,
    },
    author: {
      type: String,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: String,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const Comment: Model<IComment> = model<IComment>('Comment', commentSchema);

export default Comment;
