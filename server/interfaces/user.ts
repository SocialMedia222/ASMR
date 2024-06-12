import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}
