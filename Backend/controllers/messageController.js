import Message from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_OK } from "../utils/constants.js";

export const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.userId;

  const messages = await Message.find({
    $or: [
      { senderId: currentUserId, receiverId: userId },
      { senderId: userId, receiverId: currentUserId },
    ],
  }).sort({ createdAt: 1 });

  return res.status(HTTP_OK).json(
    new ApiResponse(HTTP_OK, messages, "Messages fetched")
  );
});
