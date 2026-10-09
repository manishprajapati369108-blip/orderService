import express from "express";
import Conversation from "../../models/RestrauntGroup.js";
import Participant from "../../models/Participant.js";
import { isParticipant } from "../../utils/conversationPermission.js";
import JoinRequest from "../../models/Request.js";

const router = express.Router();

///restaurant group creating

router.post("/create", async (req, res) => {
  try {
    const { avatar, name } = req.body;
    const currentUserId = req.user._id;

    if (!avatar) {
      return res.status(400).json({
        error: "Avatar Empty!! Please Choose One",
      });
    }

    if (!name) {
      return res.status(400).json({
        error: "Name Should not be Empty!!!",
      });
    }

    const restaurant = new Conversation({
      avatar: avatar,
      name: name,
      participants: [currentUserId],
      groupAdmin: [currentUserId],
    });

    await restaurant.save();

    return res.status(201).json({
      message: "Room Created Successfully!!!",
    });
  } catch (error) {
    console.error("Server Problem :", error);
    return res.status(500).json({
      error: "internal server error",
    });
  }
});

router.post("/:hotelId/join-request", async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user._id;

    const hotel = await Conversation.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    //it gives array of admin ids
    const admins = hotel.groupAdmin;

    if (isParticipant(hotel, userId)) {
      return res.status(400).json({
        success: false,
        message: "You are already a member",
      });
    }
 
    let request = await JoinRequest.findOne({
      conversation: hotelId,
      user: userId,
    });

    if (request?.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already pending",
      });
    }

    const user = await Participant.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const requestMessage = `Request by ${user.name} to Join ${hotel.name}`;

    const receivers = admins.map((admin) => ({
      user: admin,
      isRead: false,
      readAt: null,
    }));

    if (request) {
      ((request.status = "pending"),
        (request.message = requestMessage),
        (request.requestedAt = new Date()));
      request.respondedAt = null;
      request.respondedBy = null;
      request.receiver = receivers;

      await request.save();
    } else {
      request = await JoinRequest.create({
        conversation: hotelId,
        user: userId,
        name: user.name,
        image:user.avatar,
        status: "pending",
        message: requestMessage,
        receiver: receivers,
      });
    }

    //get socket io
    const io = req.app.get("io");

    const adminIds = new Set(admins.map(String));

    //sent real time message
    adminIds.forEach((admin) => {
      io.to(`user:${admin}`).emit("join-request:new", request);
      io.to(`user:${admin}`).emit("newRequestMessage");
    });

    return res.status(201).json({
      success: true,
      message: "Join request sent successfully",
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "failed to send Join request",
    });
  }
});

export default router;
