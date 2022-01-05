import mongoose from "mongoose";
import { Password } from "../services/password";


interface UserAttrs {
  email: string;
  password: string;
  isAdmin: boolean;
  refreshToken: string[];
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc {
  email: string;
  password: string;
  isAdmin: boolean;
  refreshToken: string[];
  updatedAt: string;
  createdAt: string;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    refreshToken: [{ type: String }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
    if (this.isModified("password")){
        const hashed = Password.generatePassword(this.get('password'))
        this.set('password', hashed)
    }
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export {User};