// backend/models/brand.js
import mongoose from 'mongoose';

const formulaSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  reviews_text: String,
  example_product_description: String,
  functional_ingredients: [String],
});

const brandSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  formulas: [formulaSchema],
});

export default mongoose.model('Brand', brandSchema);
