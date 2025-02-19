// frontend/src/components/BrandList.vue
<template>
  <div>
    <h1>Brand List</h1>
    <ul>
      <li v-for="brand in brands" :key="brand._id">
        <h3>{{ brand.brand }}</h3>
        <ul>
          <li v-for="formula in brand.formulas" :key="formula._id">
            <p>{{ formula.category }}</p>
            <p>{{ formula.reviews_text }}</p>
            <p>{{ formula.example_product_description }}</p>
            <ul>
              <li v-for="ingredient in formula.functional_ingredients" :key="ingredient">{{ ingredient }}</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <button @click="fetchBrands">Reload</button>
  </div>
</template>

<script>
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default {
  name: 'BrandList',
  data() {
    return {
      brands: []
    };
  },
  methods: {
    async fetchBrands() {
      try {
        const response = await axios.get(`${backendUrl}/brands`);
        this.brands = response.data;
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    }
  },
  created() {
    this.fetchBrands();
  }
};
</script>
