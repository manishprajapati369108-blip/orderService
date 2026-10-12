import express from "express";
import Conversation from "../../models/RestrauntGroup.js";
import Participant from "../../models/Participant.js";
import { isParticipant, isAdmin } from "../../utils/conversationPermission.js";
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
      request.status = "pending";
      request.message = requestMessage;
      request.requestedAt = new Date();
      request.respondedAt = null;
      request.respondedBy = null;
      request.receiver = receivers;
      await request.save();
    } else {
      request = await JoinRequest.create({
        conversation: hotelId,
        user: userId,
        name: user.name,
        image: user.avatar,
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

//accept the join request
router.patch("/join-request/:requestId/accept", async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    const request = await JoinRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "Request already handled" });
    }

    const hotel = await Conversation.findById(request.conversation);
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    const senderId = request.user;

    if (!isAdmin(hotel, currentUserId)) {
      return res.status(401).json({
        success: false,
        message: "Only Admin can accept the request",
      });
    }

    if (isParticipant(hotel, senderId)) {
      // already a member — still mark the request handled so it leaves "pending"
      request.status = "accepted";
      request.respondedAt = new Date();
      request.respondedBy = currentUserId;
      request.receiver = request.receiver.map((r) => ({
        user: r.user,
        isRead: true,
        readAt: r.readAt ?? new Date(),
      }));
      await request.save();
      return res.status(400).json({ success: false, message: "Already a member" });
    }

    // 1. add participant + persist
    hotel.participants.push(senderId);
    await hotel.save();

    // 2. flip status + mark all receivers as read
    request.status = "accepted";
    request.respondedAt = new Date();
    request.respondedBy = currentUserId;
    request.receiver = request.receiver.map((r) => ({
      user: r.user,
      isRead: true,
      readAt: r.readAt ?? new Date(),
    }));
    await request.save();

    // 3. real-time notify
    const io = req.app.get("io");

    //first make array of ids and convert all in string and return many elemntsin array by map now we have all id in array in strings clearly 
    const notifyIds = new Set([...hotel.groupAdmin, senderId].map(String));
    notifyIds.forEach((id) => {
      io.to(`user:${id}`).emit("join-request:handled", {
        requestId,
        hotelId: String(request.conversation),
        status: "accepted",
      });
    });

    return res.status(200).json({ success: true, message: "Join request accepted" });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//decline the request
router.patch("/join-request/:requestId/decline", async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    const request = await JoinRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "Request already handled" });
    }

    const hotel = await Conversation.findById(request.conversation);
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (!isAdmin(hotel, currentUserId)) {
      return res.status(401).json({
        success: false,
        message: "Only Admin can decline the request",
      });
    }

    // flip status + mark all receivers as read
    request.status = "rejected";
    request.respondedAt = new Date();
    request.respondedBy = currentUserId;
    request.receiver = request.receiver.map((r) => ({
      user: r.user,
      isRead: true,
      readAt: r.readAt ?? new Date(),
    }));
    await request.save();

    // real-time notify
    const io = req.app.get("io");

    const notifyIds = new Set([...hotel.groupAdmin, request.user].map(String));
    notifyIds.forEach((id) => {
      io.to(`user:${id}`).emit("join-request:handled", {
        requestId,
        hotelId: String(request.conversation),
        status: "rejected",
      });
    });

    return res.status(200).json({ success: true, message: "Join request declined" });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
