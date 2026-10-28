import express, { response } from "express";
import Notice from "../../models/Notice.js";
import Conversation from "../../models/RestrauntGroup.js"; // ✅ the GROUP model
import { isAdmin } from "../../utils/conversationPermission.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

/* Verify user is a group admin for a given group */

/* GET notices — visible to any user */
router.get("/:hotelId", async (req, res) => {
    try {
        const {hotelId} = req.params;

        const result = await Notice.find({
            restaurant: {$in: hotelId}
        })

        res.status(200).json({
            success: true,
            result : result,
        })
    }catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server Problem"
        })
    }

});

/* CREATE — admin only */
router.post("/:hotelId/create", authMiddleware, async (req, res) => {
  try {
    const savedItems = req.body;
    const { hotelId } = req.params;
    const currentUserId = req.user._id;

    const hotel = await Conversation.findById(hotelId);

    if (!isAdmin(hotel, currentUserId)) {
      return res.status(401).json({
        message: "You are not in Admin List",
      });
    }

    await Notice.insertMany(
      savedItems.map((item) => ({
        ...item,
        restaurant: hotelId,
      })),
    );

    res.status(201).json({
      success: true,
      message: "Saved",
    });
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      success: false,
      message: "Server Problem ?? Try Again",
    });
  }
});

/* UPDATE — admin only */
router.patch("/:hotelId/update", authMiddleware, async (req, res) => {


});

/*Delete only*/
router.delete(
  "/:hotelId/delete/:noticeId",
  authMiddleware,
  async (req, res) => {
    try {
      const { hotelId, noticeId } = req.params;
      const currentUserId = req.user._id;

      const hotel = await Conversation.findById(hotelId);

      if (!isAdmin(hotel, currentUserId)) {
        return res.status(401).json({
          success: false,
          message: "You are not in Admin List",
        });
      }

      await Notice.findByIdAndDelete(noticeId);

      res.status(200).json({
        success: true,
        message: "deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: true,
        message: "Server Problem",
      });
    }
  },
);

export default router;
