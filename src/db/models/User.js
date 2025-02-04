import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

// userSchema.method.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;

//   return obj;
// };

export const userCollection = model('users', userSchema);
