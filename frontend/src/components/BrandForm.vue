<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? "Edit Brand" : "Add Brand" }}
        </h2>
      </div>

      <form @submit.prevent="submitBrand" class="p-6 space-y-6">
        <!-- Brand Name Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
          <input 
            v-model="brand.brand" 
            type="text" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <!-- Formula Section -->
        <div class="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Formula Details</h3>

          <!-- Reviews -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Reviews</label>
            <textarea 
              v-model="brand.formula.reviews_text"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <!-- Product Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
            <textarea 
              v-model="brand.formula.example_product_description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <!-- Functional Ingredients -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Functional Ingredients</label>
            <textarea 
              v-model="brand.formula.functional_ingredients_raw"
              @input="updateIngredients"
              rows="4"
              placeholder="Enter ingredients, one per line"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            @click="closeDialog"
            class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ isEditing ? "Update Brand" : "Add Brand" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: ['isVisible', 'closeDialog', 'editData'],
  emits: ['brand-added'],
  setup(props, { emit }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const brand = ref({
      brand: '',
      formula: {
        reviews_text: '',
        example_product_description: '',
        functional_ingredients_raw: '',
        functional_ingredients: [],
      }
    });

    // Check if editing existing data
    watch(
      () => props.editData,
      (newData) => {
        if (newData) {
          brand.value = JSON.parse(JSON.stringify(newData)); // Deep copy
          if (brand.value.formulas && brand.value.formulas.length > 0) {
            // Convert from old format to new format
            brand.value.formula = {
              ...brand.value.formulas[0],
              functional_ingredients_raw: brand.value.formulas[0].functional_ingredients.join('\n')
            };
            delete brand.value.formulas;
          }
        }
      },
      { immediate: true }
    );

    const updateIngredients = () => {
      brand.value.formula.functional_ingredients = brand.value.formula.functional_ingredients_raw
        .split('\n')
        .filter((line) => line.trim() !== '');
    };

    const submitBrand = async () => {
      const url = props.editData ? `${backendUrl}/brands/${props.editData._id}` : `${backendUrl}/brands`;
      const method = props.editData ? 'PUT' : 'POST';

      // Convert to the format expected by the API
      const submitData = {
        ...brand.value,
        formulas: [
          {
            ...brand.value.formula,
            functional_ingredients: brand.value.formula.functional_ingredients
          }
        ]
      };
      delete submitData.formula;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      emit('brand-added');
      props.closeDialog();
      brand.value = {
        brand: '',
        formula: {
          reviews_text: '',
          example_product_description: '',
          functional_ingredients_raw: '',
          functional_ingredients: [],
        }
      };
    };

    return {
      brand,
      updateIngredients,
      submitBrand,
      isEditing: ref(!!props.editData),
    };
  },
};
</script>