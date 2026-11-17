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
    const { hotelId } = req.params;

    const result = await Notice.find({
      restaurant : hotelId ,
    }).sort({
      isPinned: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      result: result,
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Problem",
    });
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

    const result = await Notice.insertMany(
      savedItems.map((item) => ({
        ...item,
        restaurant: hotelId,
      })),
    );

    res.status(201).json({
      success: true,
      message: "Saved",
      result: result
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
  try {
    const { hotelId } = req.params;
    const updatedNotices = req.body;
    const currentUserId = req.user._id;

    const hotel = await Conversation.findById(hotelId);

    if (!isAdmin(hotel, currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "Only Admin Can update",
      });
    }

    if (!Array.isArray(updatedNotices) || updatedNotices.length === 0) {
      return res.status(400).json({
        message: "No notices provided",
      });
    }

    const operations = updatedNotices.map(({ _id, title, content }) => ({
      updateOne: {
        filter: { _id, restaurant: hotelId },
        update: { $set: { title, content } },
      },
    }));

    const result = await Notice.bulkWrite(operations);

    res.status(200).json({
      success: false,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
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

router.patch("/:hotelId/:noticeId/:pinValue", authMiddleware, async (req, res) => {
  try {
    const { hotelId, noticeId, pinValue } = req.params;

    const currentUserId = req.user._id;

    const isPinned = pinValue === "true"

    const hotel = await Conversation.findById(hotelId);
 
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    if (!isAdmin(hotel, currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorised access!!!",
      });
    }

   const updatedNotice = await Notice.findByIdAndUpdate(
      { _id: noticeId, restaurant: hotelId },

      {
        $set: {
          isPinned: isPinned ,
        },
      }, {
        new: true,
      }
    );

    if(!updatedNotice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: isPinned ? "Pinned Successfully" : "Unpin Successfully",
      result: updatedNotice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Problem !!",
    });
  }
});    

export default router;
