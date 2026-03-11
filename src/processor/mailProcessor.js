import { Worker } from "bullmq";

import mailer from "../config/mailConfig.js";
import redisConfig from "../config/redisConfig.js";

new Worker(
    'mailQueue',
    async (job) => { // job obj is the same paylod the processor is going to read from the queue
        const emailData = job.data;
        console.log('Processing email', emailData);

        try {
            const response = await mailer.sendMail(emailData);
            console.log('Email sent successfully', response);
            return response;
        } catch (error) {
            console.log('Error processing email', error);
        }
    }, {
    connection: redisConfig
});