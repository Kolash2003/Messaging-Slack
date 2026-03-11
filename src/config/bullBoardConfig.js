import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import mailQueue from "../queues/mailQueue.js";
import testQueue from "../queues/testQueue.js";

const bullServerAdapter = new ExpressAdapter();
bullServerAdapter.setBasePath('/ui');

createBullBoard({
    queues: [new BullMQAdapter(mailQueue), new BullMQAdapter(testQueue)],
    serverAdapter: bullServerAdapter
});

export default bullServerAdapter;