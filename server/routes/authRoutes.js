import express from "express";

import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", createUser);

router.post("/signin", loginUser);

router.post("/signout", logoutUser);

export default router;
