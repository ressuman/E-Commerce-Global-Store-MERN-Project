import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Category name is required"],
      maxLength: [50, "Category name must be less than 50 characters"],
      unique: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
