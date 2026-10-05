import express from "express";
import Conversation from "../../models/RestrauntGroup.js";

const router = express.Router();


//fetching the restruants in which i am the member

router.get("/connected-restaurant", async(req,res) => {
    try {
    const currentUserId = req.user._id.toString();

    const group = await Conversation.find({
        participants: currentUserId,
    })

    res.status(200).json({
        success: true,
        group,
    })
} catch (error) {
    console.log(error);
    return res.status(500).json({
        error: "Server Error"
    })
}
})



//join another restaurant by searching

export default router;

