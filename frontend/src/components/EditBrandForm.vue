<template>
  <div>
    <h2>Edit Brand</h2>
    <form @submit.prevent="editBrand">
      <div>
        <label for="brand">Brand Name</label>
        <input v-model="brandName" type="text" id="brand" required />
      </div>

      <div v-for="(formula, index) in formulas" :key="index">
        <h3>Formula {{ index + 1 }}</h3>
        <div>
          <label for="category">Category</label>
          <input v-model="formula.category" type="text" id="category" required />
        </div>
        <div>
          <label for="reviews_text">Reviews</label>
          <textarea v-model="formula.reviews_text" id="reviews_text" required></textarea>
        </div>
        <div>
          <label for="example_product_description">Product Description</label>
          <textarea v-model="formula.example_product_description" id="example_product_description" required></textarea>
        </div>
        <div>
          <label for="functional_ingredients">Functional Ingredients</label>
          <textarea v-model="formula.functional_ingredients" id="functional_ingredients" required></textarea>
        </div>
      </div>

      <button type="button" @click="addFormula">Add Formula</button>
      <button type="submit">Save Changes</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['brandId'],
  data() {
    return {
      brandName: '',
      formulas: [],
    };
  },
  async created() {
    try {
      const response = await axios.get(`http://localhost:3000/brands/${this.brandId}`);
      const brand = response.data;
      this.brandName = brand.brand;
      this.formulas = brand.formulas.map((formula) => ({
        ...formula,
        functional_ingredients: formula.functional_ingredients.join('\n'),
      }));
    } catch (error) {
      console.error('Error fetching brand data', error);
    }
  },
  methods: {
    async editBrand() {
      const updatedBrand = {
        brand: this.brandName,
        formulas: this.formulas.map((formula) => ({
          ...formula,
          functional_ingredients: formula.functional_ingredients.split('\n'),
        })),
      };

      try {
        await axios.put(`http://localhost:3000/brands/${this.brandId}`, updatedBrand);
        alert('Brand updated successfully!');
        this.$router.push('/');
      } catch (error) {
        alert('Error updating brand');
      }
    },
    addFormula() {
      this.formulas.push({
        category: '',
        reviews_text: '',
        example_product_description: '',
        functional_ingredients: [''],
      });
    },
  },
};
</script>
