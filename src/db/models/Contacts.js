// import { required } from 'joi';
import { model, Schema, Types } from 'mongoose';
import { userCollection } from './User.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: {
      type: Types.ObjectId,
      ref: userCollection,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const contactsCollection = model('contact', contactsSchema);
