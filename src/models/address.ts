import mongoose from "mongoose";

interface AddressAttrs {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  streetNumber: string;
  city: string;
  postal: string;
}

interface AddressModel extends mongoose.Model<AddressDoc> {
  build(attrs: AddressAttrs): AddressDoc;
}

export interface AddressDoc {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  streetNumber: string;
  city: string;
  postal: string;
}

export const addressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  streetNumber: { type: String, required: true },
  city: { type: String, required: true },
  postal: { type: String, required: true },
});

addressSchema.statics.build = (attrs: AddressAttrs) => {
  return new Address(attrs);
};

const Address = mongoose.model<AddressDoc, AddressModel>(
  "Address",
  addressSchema
);

export { Address };
