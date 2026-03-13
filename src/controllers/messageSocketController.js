import { createMessageService } from "../services/messageService.js";
import { NEW_MESSAGE_EVENTS, NEW_MESSAGE_EVENTS_RECEIVED } from "../utils/common/eventConstants.js";

export default function messageHandlers(io, socket) {
    socket.on(NEW_MESSAGE_EVENTS, async function createMessageHandler(data, callback) {
        const messageResponse = await createMessageService(data);
        const channelId = data.channelId;
        // socket.broadcast.emit(NEW_MESSAGE_EVENTS_RECEIVED, messageResponse);
        io.to(channelId).emit(NEW_MESSAGE_EVENTS_RECEIVED, messageResponse); // implementation of rooms
        callback({
            success: true,
            message: 'sucessfully created the message',
            data: messageResponse
        });
    });
}


