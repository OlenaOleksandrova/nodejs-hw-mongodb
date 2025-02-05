import { model, Schema } from 'mongoose';
import { userCollection } from './User.js';

const sessionSchema = new Schema(
  {
    // userId: { type: String, required: true },
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: userCollection,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const sessionCollection = model('sessions', sessionSchema);
