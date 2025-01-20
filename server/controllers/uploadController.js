import path from "path";
import fs from "fs";
import multer from "multer";
import Category from "../models/categoryModel.js";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },

//   filename: (req, file, cb) => {
//     const extname = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`);
//   },
// });
//

// Create dynamic storage destination based on category
// Multer storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { category } = req.body;

      if (!category) {
        return cb(
          new Error("Category is required for uploading an image"),
          false
        );
      }

      const existingCategory = await Category.findOne({
        name: category.trim(),
      });

      if (!existingCategory) {
        return cb(new Error("Category does not exist"), false);
      }

      const sanitizedCategory = category.replace(/[^a-zA-Z0-9-_]/g, "_").trim();

      // Create a category-specific directory dynamically
      const uploadPath = path.join(process.cwd(), "uploads", sanitizedCategory);
      fs.mkdirSync(uploadPath, { recursive: true }); // Create if it doesn't exist

      cb(null, uploadPath);
    } catch (error) {
      cb(error, false);
    }
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const { category } = req.body;

//     if (!category) {
//       return cb(
//         new Error("Category is required for uploading an image"),
//         false
//       );
//     }

//     const existingCategory = await Category.findOne({ name: category });

//     if (!existingCategory) {
//       return cb(new Error("Category does not exist"), false);
//     }

//     // Create directory dynamically if it doesn't exist
//     const uploadPath = path.join(__dirname, "uploads/");
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true }); // Create uploads directory if not exists
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const extname = path.extname(file.originalname).toLowerCase();
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`);
//   },
// });

// File filter for image

// const fileFilter = (req, file, cb) => {
//   const filetypes = /jpe?g|png|webp/;
//   const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

//   const extname = path.extname(file.originalname).toLowerCase();
//   const mimetype = file.mimetype;

//   console.log(`File extension: ${extname}, MIME type: ${mimetype}`);

//   if (filetypes.test(extname) && mimetypes.test(mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(
//         "Images only- Only .jpeg, .jpg, .png, and .webp images are allowed"
//       ),
//       false
//     );
//   }
// };
// File filter for image validation
const fileFilter = (req, file, cb) => {
  //const allowedFileTypes = /jpe?g|png|webp/;
  const allowedFileTypes = /jpe?g|png|webp|gif|svg/;
  const allowedMimeTypes =
    /image\/jpe?g|image\/png|image\/webp|image\/gif|image\/svg\+xml/;
  //const allowedMimeTypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (allowedFileTypes.test(extname) && allowedMimeTypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only .jpeg, .jpg, .png, .webp, .gif, and .svg images are allowed"
      ),
      false
    );
  }
};

// Configure Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

// Middleware to handle single image uploads
const uploadSingleImage = upload.single("image");

// export const handleImageUpload = (req, res) => {
//   uploadSingleImage(req, res, (err) => {
//     if (err) {
//       res.status(400).send({ message: err.message });
//     } else if (req.file) {
//       res.status(200).send({
//         message: "Image uploaded successfully",
//         image: `/${req.file.path}`,
//       });
//     } else {
//       res.status(400).send({ message: "No image file provided" });
//     }
//   });
// };

// Controller for handling image upload
export const handleImageUpload = (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors (e.g., file size limits)
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      // Custom errors (e.g., file type, category validation)
      return res.status(400).json({ message: err.message });
    } else if (!req.file) {
      // No file provided
      return res.status(400).json({ message: "No image file provided" });
    }

    // Successful upload
    return res.status(200).json({
      message: "Image uploaded successfully",
      //image: `/${req.file.path.replace(/\\/g, "/")}`, // Normalize path for all environments
      image: path.posix.join("/", req.file.path),
    });
  });
};

// export const handleImageUpload = (req, res) => {
//   uploadSingleImage(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // Multer-specific errors (e.g., limits)
//       res.status(400).json({ message: `Multer error: ${err.message}` });
//     } else if (err) {
//       // Custom errors (e.g., file type)
//       res.status(400).json({ message: err.message });
//     } else if (!req.file) {
//       // No file provided
//       res.status(400).json({ message: "No image file provided" });
//     } else {
//       // Successful upload
//       res.status(200).json({
//         message: "Image uploaded successfully",
//         image: `/${req.file.path.replace(/\\/g, "/")}`, // Normalize path for all environments
//       });
//     }
//   });
// };
