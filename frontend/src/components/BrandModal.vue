<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
    @click="handleBackdropClick"
  >
    <div 
      class="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      @click.stop
    >
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
                @change="handleCategoryChange(brand.formulas.length - index - 1)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="" disabled>Select a category</option>
                <option value="Other">Other</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Tags Input with Autocomplete -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div class="space-y-3">
                <div class="relative">
                  <p 
                      v-if="showCategoryWarning[brand.formulas.length - index - 1]" 
                      class="text-red-600 text-sm mt-1"
                    >
                      Please select a category first
                    </p>
                  <div 
                    class="relative" 
                    :ref="el => { if (el) tagsContainers[brand.formulas.length - index - 1] = el }"
                  >
                  <input 
                      v-model="formulaTags[brand.formulas.length - index - 1]"
                      @input="handleTagInput(brand.formulas.length - index - 1)"
                      @keydown.enter.prevent="selectFirstTagSuggestion(brand.formulas.length - index - 1)"
                      @keydown.tab.prevent="handleTagTabComplete(brand.formulas.length - index - 1)"
                      @keydown.up.prevent="handleTagArrowKeys('up', brand.formulas.length - index - 1)"
                      @keydown.down.prevent="handleTagArrowKeys('down', brand.formulas.length - index - 1)"
                      type="text"
                      placeholder="Type a tag and press Enter"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      :class="{'pr-20': tagSuggestions.length > 0}"
                      autocomplete="off"
                      @focus="checkCategorySelected(brand.formulas.length - index - 1)"
                    />
                    <div 
                      v-if="tagSuggestions.length > 0 && activeTagFormulaIndex === (brand.formulas.length - index - 1)"
                      class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                      @click.stop
                    >
                      <div 
                        v-for="(suggestion, idx) in tagSuggestions" 
                        :key="suggestion"
                        @click="selectTagSuggestion(suggestion, brand.formulas.length - index - 1)"
                        @mouseenter="selectedTagSuggestionIndex = idx"
                        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        :class="{'bg-gray-100': selectedTagSuggestionIndex === idx}"
                      >
                        {{ suggestion }}
                      </div>
                    </div>
                    <button 
                      type="button"
                      @click="addTag(brand.formulas.length - index - 1)"
                      class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:cursor-pointer hover:bg-blue-200 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <!-- Selected Tags -->
                <div class="flex flex-wrap gap-2">
                  <div 
                    v-for="(tag, tagIndex) in brand.formulas[brand.formulas.length - index - 1].tags" 
                    :key="tagIndex"
                    class="group flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"
                  >
                    <span>{{ tag }}</span>
                    <button 
                      type="button"
                      @click="removeTag(brand.formulas.length - index - 1, tagIndex)"
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
                <!-- Ingredients Input with Inline Autocomplete -->
                <div class="relative">
                  <div 
                    class="relative" 
                    :ref="el => { if (el) ingredientsContainers[brand.formulas.length - index - 1] = el }"
                  >
                    <input 
                      v-model="formulaIngredients[brand.formulas.length - index - 1]"
                      @input="handleIngredientInput(brand.formulas.length - index - 1)"
                      @keydown.enter.prevent="handleIngredientEnter(brand.formulas.length - index - 1)"
                      @keydown.tab.prevent="handleTabComplete(brand.formulas.length - index - 1)"
                      @keydown.up.prevent="handleArrowKeys('up', brand.formulas.length - index - 1)"
                      @keydown.down.prevent="handleArrowKeys('down', brand.formulas.length - index - 1)"
                      type="text"
                      placeholder="Type an ingredient and press Enter"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      :class="{'pr-20': suggestions.length > 0}"
                      autocomplete="off"
                    />
                    <div 
                      v-if="suggestions.length > 0 && activeFormulaIndex === (brand.formulas.length - index - 1)"
                      class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                      @click.stop
                    >
                      <div 
                        v-for="(suggestion, idx) in suggestions" 
                        :key="suggestion"
                        @click="selectSuggestion(suggestion, brand.formulas.length - index - 1)"
                        @mouseenter="selectedSuggestionIndex = idx"
                        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        :class="{'bg-gray-100': selectedSuggestionIndex === idx}"
                      >
                        {{ suggestion }}
                      </div>
                    </div>
                    <button 
                      type="button"
                      @click="addIngredient(brand.formulas.length - index - 1)"
                      class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:cursor-pointer hover:bg-blue-200 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
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
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import ConfirmationModal from './ConfirmationModal.vue';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const reasons = [
  "Best Seller",
  "Trending",
  "Full Brand Profile"
];

const createEmptyFormula = () => ({
  category: '',
  tags: [],
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
    const formulaTags = ref(['']);
    const formulaToRemove = ref(null);
    const suggestions = ref([]);
    const tagSuggestions = ref([]);
    const selectedSuggestionIndex = ref(0);
    const selectedTagSuggestionIndex = ref(0);
    const activeFormulaIndex = ref(null);
    const activeTagFormulaIndex = ref(null);
    const ingredientsContainers = ref({});
    const tagsContainers = ref({});
    const categories = ref([]);
    const availableTags = ref({});
    let debounceTimeout = null;
    let tagDebounceTimeout = null;
    const showCategoryWarning = ref({});

    const checkCategorySelected = (formulaIndex) => {
      if (!brand.value.formulas[formulaIndex].category) {
        showCategoryWarning.value[formulaIndex] = true;
        // Clear the warning after 3 seconds
        setTimeout(() => {
          showCategoryWarning.value[formulaIndex] = false;
        }, 3000);
      }
    };

    // Fetch categories and tags from the server
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${backendUrl}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        categories.value = data.categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    const fetchTags = async (category, formulaIndex) => {
      try {
        if (category === 'Other') {
          // For "Other" category, fetch all tags from all categories
          const response = await fetch(`${backendUrl}/categories`);
          if (!response.ok) throw new Error('Failed to fetch categories');
          const data = await response.json();
          
          // Flatten all tags from all categories into a single unique array
          const allTags = [...new Set(Object.values(data.categoriesMap).flat())];
          availableTags.value[formulaIndex] = allTags;
        } else {
          const response = await fetch(`${backendUrl}/categories/${encodeURIComponent(category)}/tags`);
          if (!response.ok) throw new Error('Failed to fetch tags');
          const tags = await response.json();
          availableTags.value[formulaIndex] = tags;
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
        toast.error('Failed to load tags');
      }
    };

    const handleCategoryChange = async (formulaIndex) => {
      const category = brand.value.formulas[formulaIndex].category;
      if (category) {
        await fetchTags(category, formulaIndex);
        brand.value.formulas[formulaIndex].tags = []; // Reset tags when category changes
      }
    };

    // Tag handling functions
    const handleTagInput = (formulaIndex) => {
      if (!brand.value.formulas[formulaIndex].category) {
        showCategoryWarning.value[formulaIndex] = true;
        return;
      }

      activeTagFormulaIndex.value = formulaIndex;
      const query = formulaTags.value[formulaIndex].trim().toLowerCase();

      if (tagDebounceTimeout) {
        clearTimeout(tagDebounceTimeout);
      }

      if (query.length > 0 && availableTags.value[formulaIndex]) {
        tagDebounceTimeout = setTimeout(() => {
          tagSuggestions.value = availableTags.value[formulaIndex].filter(tag => 
            tag.toLowerCase().includes(query) &&
            !brand.value.formulas[formulaIndex].tags.includes(tag)
          );
          selectedTagSuggestionIndex.value = 0;
        }, 200);
      } else {
        tagSuggestions.value = [];
      }
    };

    const selectTagSuggestion = (tag, formulaIndex) => {
      formulaTags.value[formulaIndex] = tag;
      tagSuggestions.value = [];
      addTag(formulaIndex);
    };

    const handleTagTabComplete = (formulaIndex) => {
      if (tagSuggestions.value.length > 0) {
        selectTagSuggestion(tagSuggestions.value[selectedTagSuggestionIndex.value], formulaIndex);
      }
    };

    const handleTagArrowKeys = (direction, formulaIndex) => {
      if (tagSuggestions.value.length === 0) return;

      if (direction === 'up') {
        selectedTagSuggestionIndex.value = selectedTagSuggestionIndex.value > 0 
          ? selectedTagSuggestionIndex.value - 1 
          : tagSuggestions.value.length - 1;
      } else {
        selectedTagSuggestionIndex.value = selectedTagSuggestionIndex.value < tagSuggestions.value.length - 1 
          ? selectedTagSuggestionIndex.value + 1 
          : 0;
      }

      // Update the input field with the currently selected suggestion
      formulaTags.value[formulaIndex] = tagSuggestions.value[selectedTagSuggestionIndex.value];
    };

    const addTag = (formulaIndex) => {
      const tag = formulaTags.value[formulaIndex].trim();
      if (tag && !brand.value.formulas[formulaIndex].tags.includes(tag)) {
        brand.value.formulas[formulaIndex].tags.push(tag);
        formulaTags.value[formulaIndex] = '';
        tagSuggestions.value = [];
        toast.success(`Added tag: ${tag}`);
      }
    };

    const removeTag = (formulaIndex, tagIndex) => {
      const tag = brand.value.formulas[formulaIndex].tags[tagIndex];
      brand.value.formulas[formulaIndex].tags.splice(tagIndex, 1);
      toast.info(`Removed tag: ${tag}`);
    };

    // Handle click outside for suggestions dropdowns
    const handleClickOutside = (event) => {
      const activeContainer = ingredientsContainers.value[activeFormulaIndex.value];
      const activeTagContainer = tagsContainers.value[activeTagFormulaIndex.value];

      if (activeContainer && !activeContainer.contains(event.target)) {
        suggestions.value = [];
        activeFormulaIndex.value = null;
      }

      if (activeTagContainer && !activeTagContainer.contains(event.target)) {
        tagSuggestions.value = [];
        activeTagFormulaIndex.value = null;
      }
    };

    // Handle click on modal backdrop
    const handleBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        props.closeDialog();
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      fetchCategories();
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

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
          formulaTags.value = new Array(brand.value.formulas.length).fill('');
          // Fetch tags for each formula's category
          brand.value.formulas.forEach((formula, index) => {
            if (formula.category) {
              fetchTags(formula.category, index);
            }
          });
        } else {
          brand.value = {
            brand: '',
            formulas: [createEmptyFormula()]
          };
          formulaIngredients.value = [''];
          formulaTags.value = [''];
          availableTags.value = {};
        }
      },
      { immediate: true }
    );

    const fetchIngredientSuggestions = async (query) => {
      try {
        const response = await fetch(`${backendUrl}/ingredients/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        const data = await response.json();
        suggestions.value = data;
        selectedSuggestionIndex.value = 0;
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        suggestions.value = [];
      }
    };

    const selectFirstSuggestion = (formulaIndex) => {
      if (suggestions.value.length > 0) {
        selectSuggestion(suggestions.value[selectedSuggestionIndex.value], formulaIndex);
      }
    };

    const selectFirstTagSuggestion = (formulaIndex) => {
      if (tagSuggestions.value.length > 0) {
        selectTagSuggestion(tagSuggestions.value[selectedTagSuggestionIndex.value], formulaIndex);
      }
    };

    const handleIngredientInput = (formulaIndex) => {
      activeFormulaIndex.value = formulaIndex;
      const query = formulaIngredients.value[formulaIndex].trim();

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      if (query.length > 0) {
        debounceTimeout = setTimeout(() => {
          fetchIngredientSuggestions(query);
          selectedSuggestionIndex.value = 0;
        }, 200);
      } else {
        suggestions.value = [];
      }
    };

    const handleIngredientEnter = (formulaIndex) => {
      if (suggestions.value.length > 0) {
        // If there are suggestions, select the currently highlighted one
        selectSuggestion(suggestions.value[selectedSuggestionIndex.value], formulaIndex);
      } else {
        // If no suggestions, add the custom ingredient
        const ingredient = formulaIngredients.value[formulaIndex].trim();
        if (ingredient) {
          addIngredient(formulaIndex);
        }
      }
    };

    const selectSuggestion = (suggestion, formulaIndex) => {
      formulaIngredients.value[formulaIndex] = suggestion;
      suggestions.value = [];
      addIngredient(formulaIndex);
    };

    const handleTabComplete = (formulaIndex) => {
      if (suggestions.value.length > 0) {
        selectSuggestion(suggestions.value[selectedSuggestionIndex.value], formulaIndex);
      }
    };

    const handleArrowKeys = (direction, formulaIndex) => {
      if (suggestions.value.length === 0) return;

      if (direction === 'up') {
        selectedSuggestionIndex.value = selectedSuggestionIndex.value > 0 
          ? selectedSuggestionIndex.value - 1 
          : suggestions.value.length - 1;
      } else {
        selectedSuggestionIndex.value = selectedSuggestionIndex.value < suggestions.value.length - 1 
          ? selectedSuggestionIndex.value + 1 
          : 0;
      }

      // Update the input field with the currently selected suggestion
      formulaIngredients.value[formulaIndex] = suggestions.value[selectedSuggestionIndex.value];
    };

    const addNewFormula = () => {
      brand.value.formulas.push(createEmptyFormula());
      formulaIngredients.value.push('');
      formulaTags.value.push('');
      toast.info("New formula added");
    };

    const confirmRemoveFormula = (index) => {
      formulaToRemove.value = index;
    };

    const handleRemoveFormulaConfirm = () => {
      if (brand.value.formulas.length > 1) {
        brand.value.formulas.splice(formulaToRemove.value, 1);
        formulaIngredients.value.splice(formulaToRemove.value, 1);
        formulaTags.value.splice(formulaToRemove.value, 1);
        toast.info("Formula removed");
      }
      formulaToRemove.value = null;
    };

    const addIngredient = (formulaIndex) => {
      const ingredient = formulaIngredients.value[formulaIndex].trim();
      if (ingredient && !brand.value.formulas[formulaIndex].functional_ingredients.includes(ingredient)) {
        brand.value.formulas[formulaIndex].functional_ingredients.push(ingredient);
        formulaIngredients.value[formulaIndex] = '';
        suggestions.value = [];
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
      formulaTags,
      showCategoryWarning,
      checkCategorySelected,
      formulaToRemove,
      suggestions,
      tagSuggestions,
      selectedSuggestionIndex,
      selectedTagSuggestionIndex,
      selectFirstSuggestion,
      selectFirstTagSuggestion,
      activeFormulaIndex,
      activeTagFormulaIndex,
      ingredientsContainers,
      tagsContainers,
      availableTags,
      addNewFormula,
      confirmRemoveFormula,
      handleRemoveFormulaConfirm,
      addIngredient,
      removeIngredient,
      addTag,
      removeTag,
      submitBrand,
      handleIngredientInput,
      handleIngredientEnter,
      handleTagInput,
      selectSuggestion,
      selectTagSuggestion,
      handleTabComplete,
      handleTagTabComplete,
      handleArrowKeys,
      handleTagArrowKeys,
      handleBackdropClick,
      handleCategoryChange
    };
  },
};
</script>