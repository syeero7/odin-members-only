import { validationResult } from "express-validator";

import * as db from "../db/queries.js";
import { validatePost } from "../utils/validation.js";

export const createPostGet = (req, res) => res.render("createPost");

export const createPost = [
  validatePost,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) res.render("createPost", { errors: errors.array() });

    const { id } = req.user;
    const { title, message } = req.body;

    await db.insertPost(id, title, message);
    res.redirect("/");
  },
];

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  await db.deletePost(postId);
  res.redirect("/");
};

export const getAllPosts = async (req, res) => {
  const _posts = await db.getAllPosts();
  const promiseArray = _posts.map(async (post) => {
    const { first_name, last_name } = await db.getUserById(post.user_id);
    return { ...post, author: `${first_name} ${last_name}` };
  });
  const posts = await Promise.all(promiseArray);
  res.render("index", { posts });
};
