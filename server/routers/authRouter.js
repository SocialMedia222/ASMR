import { Router } from "express"
import { AddUser, LoginUser } from "../controllers/userController";

const router = Router();

router.post('/register', AddUser);
router.post('/login', LoginUser);

export const authRouter = router;