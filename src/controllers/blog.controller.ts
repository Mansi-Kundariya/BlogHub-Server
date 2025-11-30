import { type Request, type Response } from "express";
import { Blog } from "../models";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/**
 * CREATE BLOG
 */
export const createBlog = async (req: Request, res: Response) => {
  try {
    const {
      title,
      subtitle,
      slug,
      categories,
      content,
      author,
      status,
      createdBy,
      publishDateAndTime,
    } = req.body;

    const thumbnail = req.file ? req.file.filename : null;

    const blog = await Blog.findOne({ where: { slug } });
    if (blog) {
      return res.status(400).json({
        success: false,
        message: "Blog with this slug already exists",
      });
    }

    const newBlog = await Blog.create({
      title,
      subtitle,
      slug,
      thumbnail,
      categories,
      content,
      author,
      status: status || "draft",
      createdBy,
      createdAt: new Date(),
      updatedBy: createdBy,
      updatedAt: new Date(),
      publishDateAndTime,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error: any) {
    console.error("Create Blog Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE BLOG
 */
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const {
      title,
      subtitle,
      slug,
      categories,
      content,
      author,
      status,
      updatedBy,
      publishDateAndTime,
    } = req.body;

    // If new thumbnail uploaded
    const thumbnail = req.file ? req.file.filename : blog.thumbnail;

    await blog.update({
      title: title ?? blog.title,
      subtitle: subtitle ?? blog.subtitle,
      slug: slug ?? blog.slug,
      thumbnail,
      categories: categories ?? blog.categories,
      content: content ?? blog.content,
      author: author ?? blog.author,
      status: status ?? blog.status,
      updatedBy: updatedBy || blog.updatedBy,
      updatedAt: new Date(),
      publishDateAndTime: publishDateAndTime ?? blog.publishDateAndTime,
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error: any) {
    console.error("Update Blog Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE BLOG
 */
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Delete thumbnail file from uploads folder
    if (blog.thumbnail) {
      const filePath = path.join(__dirname, "../uploads", blog.thumbnail);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await blog.destroy();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Blog Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET ALL BLOGS
 */
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const status = req.body?.status || null;
    let query = {};

    if (status) {
      query = { status };
    }

    const blogs = await Blog.findAll({
      where: { ...query },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, data: blogs });
  } catch (error: any) {
    console.error("Get All Blogs Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET SINGLE BLOG
 */
export const getBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (error: any) {
    console.error("Get Single Blog Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
