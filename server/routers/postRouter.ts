import { z } from "zod";
import { t } from "../lib/trpc";
import Post from "../models/post";
import { TRPCError } from "@trpc/server";
import Comment from "../models/comment";

export const postRouter = t.router({
  createPost: t.procedure
    .input(z.object({
      userId: z.string(),
      content: z.string().min(1)
    }))
    .mutation(async ({ input }) => {
      const newPost = await Post.create({ author: input.userId, content: input.content })
      return newPost;
    }),
  deletePost: t.procedure
    .input(z.object({
      postId: z.string(),
      userId: z.string()
    }))
    .mutation(async ({ input }) => {
      try {
        await Post.deleteOne({ _id: input.postId, author: input.userId });
        return true;
      } catch (_e) {
        return false;
      }
    }),
  updatePost: t.procedure
    .input(z.object({
      postId: z.string(),
      userId: z.string(),
      newContent: z.string()
    }))
    .mutation(async ({ input }) => {
      const post = await Post.findOne({ _id: input.postId });
      if (!post) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No Posts found!" });
      }
      post.content = input.newContent;
      post.save();
      return post;
    }),
  getPost: t.procedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input }) => {
      const post = await Post.findOne({ _id: input.id });
      if(!post){
        throw new TRPCError({ code: "BAD_REQUEST", message: "No Posts found!" });
      } 
      let comments = Comment.find({ postId: post._id });
      return {
        post: post,
        comments: comments
      };
    })
})