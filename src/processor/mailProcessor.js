import mailer from "../config/mailConfig.js";
import mailQueue from "../queues/mailQueue.js";

mailQueue.process(async (job) => { // job obj is the same paylod the processor is going to read from the queue
    const emailData = job.data;
    console.log('Processing email', emailData);

    try {
        const response = await mailer.sendMail(emailData);
        console.log('Email sent successfully', response);
        return response;
    } catch (error) {
        console.log('Error processing email', error);
    }
})