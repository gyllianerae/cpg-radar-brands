// backend/models/brand.js
import mongoose from 'mongoose';

const formulaSchema = new mongoose.Schema({
  reason: String,
  category: String,
  reviews_text: String,
  example_product_description: String,
  functional_ingredients: [String],
});

const brandSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  formulas: [formulaSchema],
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
