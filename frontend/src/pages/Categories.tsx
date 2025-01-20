import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types';
import { categoryService } from '../services/category.service';
import AddCategoryModal from '../components/categories/AddCategoryModal';
import EditCategoryModal from '../components/categories/EditCategoryModal';
import Modal from '../components/common/Modal';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (data: CreateCategoryDto) => {
    try {
      const newCategory = await categoryService.create(data);
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEditCategory = async (id: string, data: Partial<UpdateCategoryDto>) => {
    try {
      const updatedCategory = await categoryService.update(id.toString(), data);
      setCategories(categories.map(cat => 
        cat._id === updatedCategory._id ? updatedCategory : cat
      ));
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoryService.delete(id);
      setCategories(categories.filter(cat => cat._id !== id));
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === 'all' || category.type === filterType)
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const CategoryItem = ({ category }: { category: Category }) => (
    <div
      className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span>{category.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => handleEditClick(category)}
          className="text-gray-500 hover:text-black"
        >
          <span className="sr-only">Edit</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button 
          onClick={() => {
            setSelectedCategory(category);
            setIsDeleteModalOpen(true);
          }}
          className="text-gray-500 hover:text-red-500"
        >
          <span className="sr-only">Delete</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categories</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            Add Category
          </button>
        </div>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
                // Start of Selection
                />
              </div>
              <select
                aria-label="Filter Type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                className="input md:w-48"
              >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
          <div className="space-y-3">
            {filteredCategories
              .filter(category => category.type === 'expense')
              .map(category => (
                <CategoryItem key={category._id} category={category} />
              ))}
          </div>
        </motion.div>

        {/* Income Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Income Categories</h2>
          <div className="space-y-3">
            {filteredCategories
              .filter(category => category.type === 'income')
              .map(category => (
                <CategoryItem key={category._id} category={category} />
              ))}
          </div>
        </motion.div>
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategory}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleEditCategory}
        category={selectedCategory}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the category "{selectedCategory?.name}"? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedCategory && handleDeleteCategory(selectedCategory._id)}
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories; 