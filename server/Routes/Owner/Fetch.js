import express from "express";
import Conversation from "../../models/RestrauntGroup.js";
import JoinRequest from "../../models/Request.js";

const router = express.Router();

//fetching the restruants in which i am the member

router.get("/connected-restaurant", async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    const group = await Conversation.find({
      participants: currentUserId,
    });

    res.status(200).json({
      success: true,
      group,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Server Error",
    });
  }
});

//join restaurant by searching uid

router.get("/join-group", async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const uid = req.query.q;

    if (!uid || !uid.trim()) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const data = await Conversation.find({
      participants: { $ne: currentUserId },
      uid: uid.trim(),
    }).limit(10);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Server Error Try Again",
    });
  }
});

//geting all request notification
router.get("/join-requests", async (req, res) => {
  try {
    const currentUser = req.user._id;

    const requestLists = await JoinRequest.find({
      "receiver.user": currentUser,
    });

    res.status(200).json({
      success: true,
      data: requestLists,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Request not fetched Try Again!!",
    });
  }
});

//getting request read count
router.get("/unread-count", async (req, res) => {
  try {
    const currentUser = req.user._id;

    const count = await JoinRequest.countDocuments({
      receiver: {
        $elemMatch: {
          user: currentUser,
          isRead: false,
        },
      },
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "failed to get unread count",
    });
  }
});
export default router;
