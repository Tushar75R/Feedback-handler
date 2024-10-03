import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  _id: mongoose.Types.ObjectId;
  title?: string;
  content?: string;
  email?: string;
  createdAt: Date;
  endpoint: string;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  email: {
    type: String,
  },
  title: {
    type: String,
  },
  endpoint: {
    type: String,
  },
});

export interface Url {
  url: string;
  endpoint: string;
  isAcceptingMessage: boolean;
  _id: mongoose.Types.ObjectId;
}

const urlSchema: Schema<Url> = new Schema({
  url: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
});

export interface User {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
  urls: Url[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Please enter a username"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter a email address"],
    unique: true,
    match: [
      /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
      "please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify code is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },
  messages: [MessageSchema],
  urls: [urlSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
