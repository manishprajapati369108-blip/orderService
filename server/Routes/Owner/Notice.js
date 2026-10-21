import express from "express";
import Notice from "../../models/Notice.js";
import Conversation from "../../models/RestrauntGroup.js"; // ✅ the GROUP model
import { isAdmin } from "../../utils/conversationPermission.js";

const router = express.Router();

/* Verify user is a group admin for a given group */

/* GET notices — visible to any authenticated user */
router.get("/:hotelId", async (req, res) => {
 
});

/* CREATE — admin only */
router.post("/create", async (req, res) => {
  
});

/* UPDATE — admin only */
router.patch("/update", async (req, res) => {

});

/* DELETE — admin only */
router.delete("/delete", async (req, res) => {

});

export default router;