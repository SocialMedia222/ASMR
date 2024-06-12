
import { t } from './lib/trpc';
import { postRouter } from './routers/postRouter';

export const router = t.router({
  posts: postRouter
});
export type AppRouter = typeof router;
