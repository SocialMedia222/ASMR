import { Schema, model, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser {
  _id: string;
  username: string;
  online: boolean;
  email: string;
  password: string;
  profileImg?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    online:{
      type:Boolean,
      default:false
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: String,
    bio: {
      type:String,
      default:""
    },
    followers: [
      {
        type: String,
        ref: 'User',
      },
    ],
    following: [
      {
        type: String,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
