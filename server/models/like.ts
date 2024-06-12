import { Schema, model, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ILike {
  _id: string;
  userId: string; // User ID
  postId?: string; // Post ID (optional if liking a comment)
  commentId?: string; // Comment ID (optional if liking a post)
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    postId: {
      type: String,
      ref: 'Post',
    },
    commentId: {
      type: String,
      ref: 'Comment',
    },
  },
  { timestamps: true }
);

const Like: Model<ILike> = model<ILike>('Like', likeSchema);

export default Like;
