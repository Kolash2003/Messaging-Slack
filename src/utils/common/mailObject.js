import { EMAIL_USER } from "../../config/serverConfig";

export const workspaceJoinEmail = function (workspaceName) {
    return {
        from: EMAIL_USER,
        subject: 'You have been added to a workspace',
        text: `You have been added to a workspace ${workspaceName}`
    }
}