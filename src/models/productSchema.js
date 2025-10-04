const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ["Baño", "Dormitorio", "Living", "Cocina"],
    required: true
  },
  thumbnails: {
    type: [String],
    default: [""]
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt
  versionKey: false
});

module.exports = model("Product", productSchema);
