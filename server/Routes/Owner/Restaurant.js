import express from "express";
import Conversation from "../../models/RestrauntGroup.js";

const router = express.Router();

///restaurant group creating

router.post("/create", async(req, res) => {
    try {
        const {avatar, name} = req.body;
        const currentUserId = req.user._id

        if(!avatar) {
            return res.status(400).json({
                error: "Avatar Empty!! Please Choose One"
            })
        }

        if(!name) {
            return res.status(400).json({
                error: "Name Should not be Empty!!!"
            })
        }

        const restaurant = new Conversation({
            avatar: avatar,
            name: name,
            participants: [currentUserId],
            groupAdmin: [currentUserId],
            
        })

        await restaurant.save();

        return res.status(201).json({
            message: "Room Created Successfully!!!",
        })

    } catch(error) {
        console.error("Server Problem :", error)
        return res.status(500).json({
            error: "internal server error"
        })
    }
    
})

export default router;
