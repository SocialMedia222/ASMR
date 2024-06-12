import { Schema, model, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IPost {
  _id: string;
  author: string; // User ID
  content: string;
  image?: string;
  likes: string[]; // Array of User IDs
  comments: string[]; // Array of Comment IDs
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    _id: {
      type: String,
      default: uuidv4,
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
    image: String,
    likes: [
      {
        type: String,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: String,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);

const Post: Model<IPost> = model<IPost>('Post', postSchema);

export default Post;
