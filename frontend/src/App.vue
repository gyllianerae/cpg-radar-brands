<template>
  <div>
    <AccessGate v-if="!isAuthenticated" @access-granted="handleAccessGranted" />
    
    <div v-else class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-gray-900">Brand Management</h1>
        </header>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Brands</h2>
            <button 
              @click="openAddDialog" 
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Brand
            </button>
          </div>
          
          <div class="divide-y divide-gray-200">
            <div v-for="brand in brands" :key="brand._id" class="p-6 hover:bg-gray-50 transition-colors">
              <!-- Brand Header -->
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-gray-900">{{ brand.brand }}</h3>
                <div class="flex items-center space-x-3">
                  <button 
                    @click="openEditDialog(brand)"
                    class="inline-flex items-center px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-md hover:cursor-pointer hover:bg-amber-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button 
                    @click="confirmDeleteBrand(brand)"
                    class="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:cursor-pointer hover:bg-red-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              <!-- Formulas Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  v-for="(formula, index) in brand.formulas" 
                  :key="index"
                  class="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-medium text-gray-900">Formula {{ index + 1 }}</h4>
                    <div class="flex items-center space-x-2">
                      <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {{ formula.category }}
                      </span>
                      <span v-if="formula.reason" class="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                        {{ formula.reason }}
                      </span>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <h5 class="text-sm font-medium text-gray-500 mb-1">Product Description</h5>
                      <p class="text-gray-700">{{ formula.example_product_description || 'No description available' }}</p>
                    </div>

                    <div>
                      <h5 class="text-sm font-medium text-gray-500 mb-1">Reviews</h5>
                      <p class="text-gray-700">{{ formula.reviews_text || 'No reviews available' }}</p>
                    </div>

                    <div>
                      <h5 class="text-sm font-medium text-gray-500 mb-2">Functional Ingredients</h5>
                      <div class="flex flex-wrap gap-2">
                        <span 
                          v-for="ingredient in formula.functional_ingredients" 
                          :key="ingredient"
                          class="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full"
                        >
                          {{ ingredient }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Brand Modal (Add/Edit) -->
        <BrandModal 
          :isVisible="showModal"
          :closeDialog="closeModal"
          :editData="selectedBrand"
          @brand-added="handleBrandUpdate"
        />

        <!-- Delete Brand Confirmation Modal -->
        <ConfirmationModal
          :isVisible="!!brandToDelete"
          :title="`Delete ${brandToDelete?.brand}`"
          :message="`Are you sure you want to delete ${brandToDelete?.brand}? This action cannot be undone.`"
          type="danger"
          confirm-text="Delete"
          @confirm="handleDeleteConfirm"
          @cancel="brandToDelete = null"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import BrandModal from './components/BrandModal.vue';
import AccessGate from './components/AccessGate.vue';
import ConfirmationModal from './components/ConfirmationModal.vue';

export default {
  name: 'App',
  components: {
    BrandModal,
    AccessGate,
    ConfirmationModal
  },
  setup() {
    const toast = useToast();
    const brands = ref([]);
    const showModal = ref(false);
    const selectedBrand = ref(null);
    const isAuthenticated = ref(false);
    const brandToDelete = ref(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const checkAuthentication = () => {
      isAuthenticated.value = sessionStorage.getItem('accessGranted') === 'true';
    };

    const handleAccessGranted = async () => {
      isAuthenticated.value = true;
      await fetchBrands();
      toast.success("Access granted successfully!");
    };

    const fetchBrands = async () => {
      try {
        const response = await fetch(`${backendUrl}/brands`);
        const data = await response.json();
        brands.value = data;
      } catch (error) {
        toast.error("Failed to fetch brands");
        console.log(error);
      }
    };

    const openAddDialog = () => {
      selectedBrand.value = null;
      showModal.value = true;
    };

    const openEditDialog = (brand) => {
      selectedBrand.value = brand;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedBrand.value = null;
    };

    const handleBrandUpdate = (action) => {
      fetchBrands();
      closeModal();
      const message = action === 'edit' 
        ? "Brand updated successfully!"
        : "Brand added successfully!";
      toast.success(message);
    };

    const confirmDeleteBrand = (brand) => {
      brandToDelete.value = brand;
    };

    const handleDeleteConfirm = async () => {
      try {
        const response = await fetch(`${backendUrl}/brands/${brandToDelete.value._id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete brand');
        }
        
        await fetchBrands();
        toast.success(`${brandToDelete.value.brand} has been deleted successfully`);
        brandToDelete.value = null;
      } catch (error) {
        toast.error(`Failed to delete ${brandToDelete.value.brand}`);
      }
    };

    onMounted(() => {
      checkAuthentication();
      if (isAuthenticated.value) {
        fetchBrands();
      }
    });

    return {
      brands,
      showModal,
      selectedBrand,
      isAuthenticated,
      brandToDelete,
      openAddDialog,
      openEditDialog,
      closeModal,
      confirmDeleteBrand,
      handleDeleteConfirm,
      handleBrandUpdate,
      handleAccessGranted,
    };
  },
};
</script>