import mongoose from "mongoose";

const merchItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Merch item name is required"],
      trim: true,
      maxlength: [100, "Merch item name cannot exceed 100 characters"],
    },
    image: {
      type: String,
      required: [true, "Merch item image is required"],
    },
    price: {
      type: Number,
      required: [true, "Merch item price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    sizes: {
      type: [String],
      default: [],
    },
    nick: {
      type: Boolean,
      default: false,
    },
    nickPrice: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const comboSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Combo name is required"],
      trim: true,
      maxlength: [100, "Combo name cannot exceed 100 characters"],
    },
    items: [
      {
        type: String,
        required: [true, "Combo must contain at least one item"],
      },
    ],
    comboPrice: {
      type: Number,
      required: [true, "Combo price is required"],
      min: [0, "Combo price cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  { _id: false }
);

const merchBundleSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Club reference is required"],
    },
    title: {
      type: String,
      required: [true, "Bundle title is required"],
      trim: true,
      maxlength: [200, "Bundle title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    merchItems: {
      type: [merchItemSchema],
      required: [true, "At least one merch item is required"],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "At least one merch item is required",
      },
    },
    sizeCharts: [{ type: String }],
    combos: [comboSchema],
    approvalStatus: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    visibility: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

merchBundleSchema.index({ club: 1, approvalStatus: 1 });
merchBundleSchema.index({ approvalStatus: 1, visibility: 1 });

merchBundleSchema.virtual("isVisible").get(function () {
  return this.approvalStatus === "approved" && this.visibility === true;
});

merchBundleSchema.methods.approve = function (csaUserId) {
  this.approvalStatus = "approved";
  this.visibility = true;
  this.approvedBy = csaUserId;
  this.approvedAt = new Date();
  return this.save();
};

merchBundleSchema.methods.toggleVisibility = function () {
  if (this.approvalStatus !== "approved") {
    throw new Error("Cannot toggle visibility for non-approved bundles");
  }
  this.visibility = !this.visibility;
  return this.save();
};

merchBundleSchema.pre("save", function (next) {
  if (this.combos && this.combos.length > 0) {
    const itemNames = this.merchItems.map((item) => item.name);

    for (const combo of this.combos) {
      for (const itemName of combo.items) {
        if (!itemNames.includes(itemName)) {
          return next(
            new Error(
              `Combo "${combo.name}" contains item "${itemName}" that doesn't exist in merch items`
            )
          );
        }
      }
    }
  }
  next();
});

merchBundleSchema.set("toJSON", { virtuals: true });
merchBundleSchema.set("toObject", { virtuals: true });

export default mongoose.models.MerchBundle ||
  mongoose.model("MerchBundle", merchBundleSchema);
