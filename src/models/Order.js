import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    merchName: { type: String, required: true },
    size: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    studentBITSID: {
      type: String,
      required: true,
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    bundle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MerchBundle",
      required: true,
    },
    items: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// Compound unique index: one order per student per bundle
orderSchema.index({ studentBITSID: 1, bundle: 1 }, { unique: true });
orderSchema.index({ bundle: 1 });

orderSchema.methods.calculateTotalPrice = function () {
  return this.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
};

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
