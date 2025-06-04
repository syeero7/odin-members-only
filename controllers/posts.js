import { validationResult, body, param } from "express-validator";
import asyncHandler from "express-async-handler";
import * as db from "../db/queries.js";

export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await db.getAllPosts();

  res.render("posts", { posts });
});

export const createPostGET = (req, res) => res.render("post-form");

export const createPostPOST = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must be within 50 characters"),
  body("content")
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage("Content must be within 250 characters"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const formatted = result.formatWith(({ msg }) => msg);
      return res
        .status(400)
        .render("post-form", { errors: formatted.mapped() });
    }

    const userId = req.user.id;
    const { title, content } = req.body;

    await db.insertPost(userId, title, content);
    res.redirect("/posts");
  }),
];

export const deletePost = [
  param("postId").toInt().isNumeric(),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.sendStatus(400);

    const { postId } = req.params;
    await db.deletePost(postId);

    res.redirect("/posts");
  }),
];
