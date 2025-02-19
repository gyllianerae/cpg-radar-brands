<template>
  <div>
    <button @click="deleteBrand">Delete Brand</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['brandId'],
  methods: {
    async deleteBrand() {
      try {
        await axios.delete(`http://localhost:3000/brands/${this.brandId}`);
        alert('Brand deleted successfully!');
        this.$router.push('/');
      } catch (error) {
        alert('Error deleting brand');
      }
    },
  },
};
</script>
