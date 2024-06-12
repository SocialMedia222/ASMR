import { Router } from "express"
import { SingleUserSearchbyId, SingleUserSearchbyName, editBio, editPassword, editUsername, followUser, unfollowUser, uploadImage } from "../controllers/userController";
import { authenticate } from "../middlewares/protectedRoute";
import { upload } from "../middlewares/uploadImage";

const router = Router();

router.get('/:name', SingleUserSearchbyName);
router.get('/:id/getbyid', SingleUserSearchbyId);
router.put('/:id/follow', authenticate, followUser);
router.put('/:id/unfollow', authenticate, unfollowUser);
router.put('/editUsername', authenticate, editUsername);
router.put('/editBio', authenticate, editBio);
router.put('/editPassword', authenticate, editPassword);
router.put('/:id/uploadImage', authenticate, upload.single('image'),uploadImage);

export const userRouter = router;