import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useDeleteProductByIdMutation,
  useGetProductByIdQuery,
  useUpdateProductByIdMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productsAndUploadApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoriesApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

export default function ProductsUpdate() {
  const params = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(params._id);
  console.log(productData);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: categories = [] } = useGetCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductByIdMutation();

  const [deleteProduct] = useDeleteProductByIdMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setImage(productData?.image || "");
      setName(productData?.name || "");
      setDescription(productData?.description || "");
      setPrice(productData?.price || 0);
      setCategory(productData?.category?._id || "");
      setQuantity(productData?.quantity || 0);
      setBrand(productData?.brand || "");
      setStock(productData?.countInStock || 0);
    }
  }, [productData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !description || !price || !category || !image) {
      toast.error("All fields including image are required");
      return;
    }

    setIsUpdating(true);

    try {
      const productUpdateData = {
        name,
        description,
        price: Number(price),
        category,
        quantity: Number(quantity),
        brand,
        countInStock: Number(stock),
        image, // Cloudinary URL from state
      };

      const response = await updateProduct({
        productId: params._id,
        updatedData: productUpdateData,
      }).unwrap();

      toast.success(`${response.name} updated successfully!`);
      setTimeout(() => navigate("/admin/allProductsList"), 1000);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(
        err?.data?.message || "Product update failed. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image); // Set Cloudinary URL
      toast.success("Product image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err?.data?.message || "Image upload failed");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        setIsDeleting(true);

        await deleteProduct(params._id).unwrap();

        toast.success(`${name} deleted successfully.`);
        setTimeout(() => navigate("/admin/allProductsList"), 1000);
      } catch (err) {
        toast.error(`Failed to delete ${name}.`);
        console.log(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-0">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />

        <div className="md:w-3/4 p-3 ml-24">
          <h1 className="h-12 text-4xl font-semibold mb-4 text-center">
            Update Product
          </h1>

          {image && (
            <div className="text-center mb-3">
              <img
                src={image}
                alt="Uploaded Product Preview"
                className="block mx-auto max-h-[200px] rounded"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? image.name : "Upload Image"}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? "hidden" : "text-white"}
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap justify-between">
              <div>
                <label htmlFor="name" className="block font-semibold">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter product name"
                  className="p-4 mb-3 w-full md:w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="ml-0 md:ml-10">
                <label htmlFor="price" className="block font-semibold">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  min="0"
                  className="p-4 mb-3 w-full md:w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-between">
              <div>
                <label htmlFor="quantity" className="block font-semibold">
                  Quantity
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  min="0"
                  className="p-4 mb-3 w-full md:w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="ml-0 md:ml-10">
                <label htmlFor="brand" className="block font-semibold">
                  Brand
                </label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  placeholder="Enter brand"
                  className="p-4 mb-3 w-full md:w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="block font-semibold">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                placeholder="Enter product description"
                className="p-2 mb-3 bg-[#101011] border rounded-lg w-full text-white resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="flex flex-wrap justify-between">
              <div>
                <label htmlFor="stock" className="block font-semibold">
                  Count In Stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="Enter stock count"
                  min="0"
                  className="p-4 mb-3 w-full md:w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block font-semibold">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  placeholder="Choose category"
                  className="p-4 mb-3 w-full md:w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    {categories?.length
                      ? "Choose Category"
                      : "No categories available"}
                  </option>
                  {categories &&
                    categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className={`py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 ${
                  isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isUpdating}
                onClick={handleSubmit}
              >
                {isUpdating ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                className={`py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
