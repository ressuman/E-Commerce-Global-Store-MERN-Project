import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import {
  useAddProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productsAndUploadApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoriesApiSlice";
import { toast } from "react-toastify";

export default function ProductsList() {
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useAddProductMutation();
  const { data: categories } = useGetCategoriesQuery();

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !category || !image) {
      toast.error("All fields, including image and category, are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const response = await createProduct(productData);

      if (response?.data?.error) {
        toast.error("Product creation failed. Please try again.");
      } else {
        toast.success(`${response.data.name} is created successfully.`);
        setTimeout(() => navigate("/"), 1000); // Allow success message to display
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(
        error?.response?.data?.message || "Product creation failed. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // uploadFileHandler
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (!file) {
      toast.error("No file selected. Please try again.");
      return;
    }

    // Allowed file types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Only .jpeg, .jpg, .png, .webp, .gif, and .svg images are allowed."
      );
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadProductImage(formData).unwrap();

      if (response?.image) {
        toast.success(response.message || "Image uploaded successfully.");
        setImage(response.image);
        setImageUrl(response.image);
      } else {
        throw new Error("Unexpected response format from the server.");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Image upload failed. Please try again."
      );
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-0">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />

        <div className="md:w-3/4 p-3 ml-24">
          <h1 className="h-12 text-4xl font-semibold mb-4 text-center">
            Create Product
          </h1>

          {imageUrl && (
            <div className="text-center mb-3">
              <img
                src={imageUrl}
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

            <button
              type="submit"
              className={`py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
