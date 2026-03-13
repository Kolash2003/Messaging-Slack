import { JOIN_CHANNEL } from "../utils/common/eventConstants.js";


export default function channelHandlers(io, socket) {
    socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, callback) {
        const roomId = data.channelId;
        socket.join(roomId);
        callback({
            success: true,
            message: 'sucessfully joined the channel',
            data: roomId
        });
    });
}
