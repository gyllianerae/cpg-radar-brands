<template>
  <div>
    <button @click="deleteBrand">Delete Brand</button>
  </div>
</template>

<script>
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default {
  props: ['brandId'],
  methods: {
    async deleteBrand() {
      try {
        await axios.delete(`${backendUrl}/brands/${this.brandId}`);
        alert('Brand deleted successfully!');
        this.$router.push('/');
      } catch (error) {
        alert('Error deleting brand');
      }
    },
  },
};
</script>
