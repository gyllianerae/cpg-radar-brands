<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ editData ? "Edit Brand" : "Add Brand" }}
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

        <!-- Formulas Section -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Formulas</h3>
            <button 
              type="button"
              @click="addNewFormula"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Formula
            </button>
          </div>

          <!-- Individual Formula Cards -->
          <div 
            v-for="(formula, index) in [...brand.formulas].reverse()" 
            :key="brand.formulas.length - index"
            class="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200 relative"
          >
            <!-- Remove Formula Button -->
            <button 
              v-if="brand.formulas.length > 1"
              type="button"
              @click="confirmRemoveFormula(brand.formulas.length - index - 1)"
              class="absolute top-4 right-4 text-gray-400 hover:cursor-pointer hover:text-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <div class="flex items-center space-x-2 mb-4">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Formula {{ brand.formulas.length - index }}
              </span>
            </div>

            <!-- Reason for Adding Formula -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reason for Adding Formula</label>
              <select
                v-model="brand.formulas[brand.formulas.length - index - 1].reason"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="" disabled>Select a reason</option>
                <option v-for="reason in reasons" :key="reason" :value="reason">
                  {{ reason }}
                </option>
              </select>
            </div>

            <!-- Category Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                v-model="brand.formulas[brand.formulas.length - index - 1].category"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Reviews -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reviews</label>
              <textarea 
                v-model="brand.formulas[brand.formulas.length - index - 1].reviews_text"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              ></textarea>
            </div>

            <!-- Product Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
              <textarea 
                v-model="brand.formulas[brand.formulas.length - index - 1].example_product_description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              ></textarea>
            </div>

            <!-- Functional Ingredients -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Functional Ingredients</label>
              <div class="space-y-3">
                <!-- Ingredients Input -->
                <div class="relative">
                  <input 
                    v-model="formulaIngredients[brand.formulas.length - index - 1]"
                    @keydown.enter.prevent="addIngredient(brand.formulas.length - index - 1)"
                    type="text"
                    placeholder="Type an ingredient and press Enter"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <button 
                    type="button"
                    @click="addIngredient(brand.formulas.length - index - 1)"
                    class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:cursor-pointer hover:bg-blue-200 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>

                <!-- Ingredients Tags -->
                <div class="flex flex-wrap gap-2">
                  <div 
                    v-for="(ingredient, ingredientIndex) in brand.formulas[brand.formulas.length - index - 1].functional_ingredients" 
                    :key="ingredientIndex"
                    class="group flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"
                  >
                    <span>{{ ingredient }}</span>
                    <button 
                      type="button"
                      @click="removeIngredient(brand.formulas.length - index - 1, ingredientIndex)"
                      class="text-blue-400 hover:text-blue-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            @click="closeDialog"
            class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:cursor-pointer hover:bg-blue-700 transition-colors"
          >
            {{ editData ? "Save Changes" : "Add Brand" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Remove Formula Confirmation Modal -->
    <ConfirmationModal
      :isVisible="formulaToRemove !== null"
      title="Remove Formula"
      :message="`Are you sure you want to remove Formula ${formulaToRemove !== null ? brand.formulas.length - formulaToRemove : ''}?`"
      type="warning"
      confirm-text="Remove"
      @confirm="handleRemoveFormulaConfirm"
      @cancel="formulaToRemove = null"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import ConfirmationModal from './ConfirmationModal.vue';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const categories = [
  "Immune Health",
  "Energy",
  "Beauty",
  "Gut Health",
  "Brain Health",
  "Bone Health",
  "Children's Health",
  "Healthy Aging",
  "Heart Health",
  "Hormone Support",
  "Liver & Detox",
  "Men's Health",
  "Metabolism",
  "Methylation",
  "Mood",
  "Multivitamins",
  "Probiotics",
  "Protein Powders",
  "Hair, Skin & Nails",
  "Sleep",
  "Sports Performance",
  "Stress",
  "Thyroid Support",
  "Women's Health",
  "Inflammation",
  "Prenatal & Postnatal",
  "Eye Health",
  "Joint Support",
  "Blood Sugar Support",
  "Pain Relief",
  "Antioxidant Support",
  "Cardiovascular Health",
  "Cognitive Health",
  "Detoxification",
  "Hydration"
];

const reasons = [
  "Best Seller",
  "Trending",
  "Full Brand Profile"
];

const createEmptyFormula = () => ({
  category: '',
  reason: '',
  reviews_text: '',
  example_product_description: '',
  functional_ingredients: [],
});

export default {
  components: {
    ConfirmationModal
  },
  props: ['isVisible', 'closeDialog', 'editData'],
  emits: ['brand-added'],
  setup(props, { emit }) {
    const toast = useToast();
    const brand = ref({
      brand: '',
      formulas: [createEmptyFormula()]
    });
    const formulaIngredients = ref(['']);
    const formulaToRemove = ref(null);

    watch(
      () => props.editData,
      (newData) => {
        if (newData) {
          brand.value = {
            brand: newData.brand,
            formulas: newData.formulas.length > 0 
              ? [...newData.formulas]
              : [createEmptyFormula()]
          };
          formulaIngredients.value = new Array(brand.value.formulas.length).fill('');
        } else {
          brand.value = {
            brand: '',
            formulas: [createEmptyFormula()]
          };
          formulaIngredients.value = [''];
        }
      },
      { immediate: true }
    );

    const addNewFormula = () => {
      brand.value.formulas.push(createEmptyFormula());
      formulaIngredients.value.push('');
      toast.info("New formula added");
    };

    const confirmRemoveFormula = (index) => {
      formulaToRemove.value = index;
    };

    const handleRemoveFormulaConfirm = () => {
      if (brand.value.formulas.length > 1) {
        brand.value.formulas.splice(formulaToRemove.value, 1);
        formulaIngredients.value.splice(formulaToRemove.value, 1);
        toast.info("Formula removed");
      }
      formulaToRemove.value = null;
    };

    const addIngredient = (formulaIndex) => {
      const ingredient = formulaIngredients.value[formulaIndex].trim();
      if (ingredient && !brand.value.formulas[formulaIndex].functional_ingredients.includes(ingredient)) {
        brand.value.formulas[formulaIndex].functional_ingredients.push(ingredient);
        formulaIngredients.value[formulaIndex] = '';
        toast.success(`Added ingredient: ${ingredient}`);
      }
    };

    const removeIngredient = (formulaIndex, ingredientIndex) => {
      const ingredient = brand.value.formulas[formulaIndex].functional_ingredients[ingredientIndex];
      brand.value.formulas[formulaIndex].functional_ingredients.splice(ingredientIndex, 1);
      toast.info(`Removed ingredient: ${ingredient}`);
    };

    const submitBrand = async () => {
      const url = props.editData 
        ? `${backendUrl}/brands/${props.editData._id}` 
        : `${backendUrl}/brands`;
      const method = props.editData ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(brand.value),
        });

        if (!response.ok) {
          throw new Error('Failed to save brand');
        }

        emit('brand-added', props.editData ? 'edit' : 'add');
        props.closeDialog();
      } catch (error) {
        console.error('Error saving brand:', error);
        toast.error('Failed to save brand. Please try again.');
      }
    };

    return {
      brand,
      categories,
      reasons,
      formulaIngredients,
      formulaToRemove,
      addNewFormula,
      confirmRemoveFormula,
      handleRemoveFormulaConfirm,
      addIngredient,
      removeIngredient,
      submitBrand,
    };
  },
};
</script>