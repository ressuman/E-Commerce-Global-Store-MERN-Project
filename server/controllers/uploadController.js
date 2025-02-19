import path from "path";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },

//   filename: (req, file, cb) => {
//     const extname = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`);
//   },
// });

// File filter for image validation
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /jpe?g|png|webp|gif|svg/;
//   const allowedMimeTypes =
//     /image\/jpe?g|image\/png|image\/webp|image\/gif|image\/svg\+xml/;

//   const extname = path.extname(file.originalname).toLowerCase();
//   const mimetype = file.mimetype;

//   if (allowedFileTypes.test(extname) && allowedMimeTypes.test(mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(
//         "Invalid file type. Only .jpeg, .jpg, .png, .webp, .gif, and .svg images are allowed"
//       ),
//       false
//     );
//   }
// };

// // Configure Multer
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
// });

// // Middleware to handle single image uploads
// const uploadSingleImage = upload.single("image");

// // Controller for handling image upload
// export const handleImageUpload = (req, res) => {
//   uploadSingleImage(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // Multer-specific errors (e.g., file size limits)
//       return res.status(400).json({ message: `Multer error: ${err.message}` });
//     } else if (err) {
//       // Custom errors (e.g., file type, category validation)
//       return res.status(400).json({ message: err.message });
//     } else if (!req.file) {
//       // No file provided
//       return res.status(400).json({ message: "No image file provided" });
//     }

//     // Successful upload
//     return res.status(200).json({
//       message: "Image uploaded successfully",
//       image: `/${req.file.path.replace(/\\/g, "/")}`,
//     });
//   });
// };

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ressuman-mern-markethub-shopmart",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"],
  },
});

// File filter for image validation
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpe?g|png|webp|gif|svg|avif/;
  const allowedMimeTypes =
    /image\/jpe?g|image\/png|image\/webp|image\/gif|image\/svg\+xml|image\/avif/;

  const extname = path.extname(file.originalname).toLowerCase();
  const { mimetype } = file;

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

    // Get Cloudinary URL from uploaded file
    const imageUrl = req.file.path;

    // Successful upload
    return res.status(200).json({
      message: "Image uploaded successfully",
      image: imageUrl,
      //image: `/${req.file.path.replace(/\\/g, "/")}`,
    });
  });
};
