import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../redux/api/categoriesApiSlice";
import AdminMenu from "./AdminMenu";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";

export default function CategoryList() {
  const { data: categories } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      setIsCreatingCategory(true);

      const result = await createCategory({ name }).unwrap();

      setIsCreatingCategory(false);
      setName("");
      toast.success(`${result.name} is created successfully.`);
    } catch (error) {
      console.error("Create Category Error:", error);
      toast.error(
        error.data?.message || "Creating category failed, try again."
      );
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      toast.success(`${result.name} is updated successfully.`);

      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
    } catch (error) {
      console.error("Update Category Error:", error);
      toast.error(error.data?.message || "Updating category failed.");
    }
  };

  const handleDeleteCategory = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setIsDeletingCategory(true);

        const result = await deleteCategory(selectedCategory._id).unwrap();

        toast.success(`${result.category.name} is deleted successfully.`);

        setIsDeletingCategory(false);
        setSelectedCategory(null);
        setModalVisible(false);
      } catch (error) {
        console.error("Delete Category Error:", error);
        toast.error("Category deletion failed. Try again.");
      }
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <AdminMenu />
      <div className="md:w-3/4 p-4 ml-20">
        <h1 className="h-12 text-4xl font-semibold mb-4 text-center">
          Manage Categories
        </h1>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
          buttonText="Create"
          isSubmitting={isCreatingCategory}
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories?.length ? (
            categories.map((category) => (
              <div key={category._id}>
                <button
                  className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                >
                  {category.name}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No categories available. Create one to get started!.
            </p>
          )}
        </div>

        {modalVisible && (
          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <CategoryForm
              value={updatingName}
              setValue={setUpdatingName}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
              isDeleting={isDeletingCategory}
              isSubmitting={isCreatingCategory}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
