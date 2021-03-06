import mongoose from "mongoose";
import { Password } from "../services/password";
import { AddressDoc } from "./address";

interface UserAttrs {
  email: string;
  password: string;
  isAdmin: boolean;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isAdmin: boolean;
  updatedAt: string;
  createdAt: string;
  addresses: AddressDoc[]
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    firstName: {type: String},
    lastName:{type: String},
    addresses:  [{ type: mongoose.Types.ObjectId, ref: "Address" }],
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

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.generatePassword(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
