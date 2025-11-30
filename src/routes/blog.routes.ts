import { Router } from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlog, updateBlog } from "../controllers/blog.controller";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/all", getAllBlogs);
router.get("/:id", getBlog);
router.post("/create", upload.single("thumbnail"), createBlog);
router.put("/:id", upload.single("thumbnail"), updateBlog);
router.delete("/:id", upload.single("thumbnail"), deleteBlog);

export default router;
