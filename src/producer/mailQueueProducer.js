import '../processor/mailProcessor.js'

import mailQueue from "../queues/mailQueue.js";

export default async (emailData) => {
    console.log('Initiating email sending process');

    try {
        await mailQueue.add(emailData);
        console.log('Email added to mail queue', emailData);
    } catch (error) {
        console.log('Add email to queue error', error);
    }
};