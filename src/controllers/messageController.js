import { StatusCodes } from "http-status-codes";

import { getMessagesService } from "../services/messageService.js";
import { customErrorResponse, successResponse } from "../utils/.js";

export const getMessagesController = async (req, res) => {
    try {

        const messages = await getMessagesService({
            channelId: req.params.channelId,
        },
            req.query.page || 1,
            req.query.limti || 20
        );

        return res.status(StatusCodes.OK).json(successResponse(messages, 'Messages fetched successfully'));
    } catch (error) {
        console.log('Error in getMessagesController', error);

        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(customErrorResponse(error));
    }
}