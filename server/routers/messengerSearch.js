import express from "express";
import User from "../models/user";
const searchRouter = express.Router();
searchRouter.get('/messageSearch/:username', async (req,res)=>{
    const {username} = req.params;
    try{
        const user = await User.findOne({username});
        if (user) {
            res.send(user);
          } else {
            res.status(404).json({ message: 'User not found' });
          }
    }catch(error){
        res.status(500).json({message: "Server Error"});
    }
})
export default searchRouter;