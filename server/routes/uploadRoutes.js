import express from "express";

import { handleImageUpload } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/images/upload", handleImageUpload);

export default router;
