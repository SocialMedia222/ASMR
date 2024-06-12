/* eslint-disable no-undef */
import UserModel from "../models/user";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';

export const AddUser = async (req, res) => {
    try {

        const { username, email, password, image } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are mandatory!" });
        }

        const findEmail = await UserModel.findOne({ email });
        if (findEmail) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        const findUsername = await UserModel.findOne({ username });
        if (findUsername) {
            return res.status(400).json({ message: "Username already registered!" });
        }

        const hashPassword = await bcrypt.hash(password, 8);
        const newUser = new UserModel({ username, email, password: hashPassword, profileImg: image });
        const resp = await newUser.save();

        return res.status(200).json({ message: "User Registered Successfully!", user: resp });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
}

export const LoginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are mandatory!" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email is not registered!" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Email or Password is Incorrect!" });
        }

        const token = jwt.sign(user.email, process.env.JWT_TOKEN);
        const userInfo = { "_id": user._id, "username": user.username, "email": user.email, "profileImg": user.profileImg, "followers": user.followers, "following": user.following, "bio": user.bio }

        return res.status(200).json({ message: "User Logged In Successfully!", token, user: userInfo });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
}

export const SingleUserSearchbyName = async (req, res) => {
    const name = req.params.name;

    try {
        const getUser = await UserModel.findOne({ username: name }, { password: 0 });
        if (!getUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        return res.status(200).json({ message: "User found!", user: getUser });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
}

export const SingleUserSearchbyId = async (req, res) => {
    const { id } = req.params;

    try {
        const getUser = await UserModel.findById(id);
        if (!getUser) {
            return res.status(400).json({ message: "User ID not found!" });
        }

        return res.status(200).json({ message: "User found!", user: getUser });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
}

export const followUser = async (req, res) => {
    const userAcc = req.user;
    const followId = req.params.id;

    if (userAcc._id == followId) {
        return res.status(500).json({ message: "You cannot follow your own account!" });
    }

    try {
        const user = await UserModel.findOne({ _id: followId })

        if (!user) {
            return res.status(500).json({ message: "User not Found!" });
        }

        const checkFollowing = userAcc.following.includes(followId);
        if (checkFollowing) {
            return res.status(500).json({ message: "You are already following this account" });
        }

        // Update follower and following arrays
        const updateFollower = await user.updateOne({ $push: { followers: userAcc._id } });
        const updateFollowing = await userAcc.updateOne({ $push: { following: user._id } });

        if (!updateFollower || !updateFollowing) {
            return res.status(500).json({ message: "Error Occurred while following" });
        }

        return res.status(200).json({ message: "You followed the account", updateFollower, updateFollowing });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Occurred!", error });
    }
}

export const unfollowUser = async (req, res) => {
    const userAcc = req.user;
    const followId = req.params.id;

    if (userAcc._id == followId) {
        return res.status(500).json({ message: "You cannot unfollow your own account!" });
    }

    try {
        const user = await UserModel.findOne({ _id: followId })

        if (!user) {
            return res.status(500).json({ message: "User not Found!" });
        }

        const checkFollowing = userAcc.following.includes(followId);

        if (!checkFollowing) {
            return res.status(500).json({ message: "You are not following this account" });
        }

        // Update follower and following arrays
        const updateFollower = await user.updateOne({ $pull: { followers: userAcc._id } });
        const updateFollowing = await userAcc.updateOne({ $pull: { following: user._id } });

        if (!updateFollower || !updateFollowing) {
            return res.status(500).json({ message: "Error Occurred while unfollowing" });
        }

        return res.status(200).json({ message: "You unfollowed the account", updateFollower, updateFollowing });
    } catch (error) {
        return res.status(500).json({ message: "Error Occurred!", error })
    }
}

export const editUsername = async (req, res) => {
    const userId = req.user._id;
    const { username: newUsername } = req.body;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        return res.status(200).json({ message: "Username updated!", user: updatedUser });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
}

export const editBio = async (req, res) => {
    const userId = req.user._id;
    const { bio: newBio } = req.body;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { bio: newBio },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        return res.status(200).json({ message: "Bio updated!", user: updatedUser });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
}

export const editPassword = async (req, res) => {
    const userId = req.user._id;
    const { password: newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        return res.status(200).json({ message: "Password updated!", user: updatedUser });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
}

export const uploadImage = async (req, res) => {
    const image = req.file.path;
    const paramsId = req.params.id;

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        if (!image) {
            return res.status(500).json({ message: "No file uploaded!" });
        }

        const cloudinaryResult = await cloudinary.uploader.upload(image);
        if (!cloudinaryResult) {
            return res.status(500).json({ message: "Error while storing image!" });
        }

        const findUser = await UserModel.findById({ _id: paramsId });
        if (!findUser) {
            return res.status(500).json({ message: "Error while finding User!" });
        }

        const storeImage = await findUser.updateOne({ profileImg: cloudinaryResult.secure_url });
        if (!storeImage) {
            return res.status(500).json({ message: "Error while updating image in user" })
        }

        return res.status(200).json({ message: "Image uploaded successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Error Occurred!", error });
    }
}