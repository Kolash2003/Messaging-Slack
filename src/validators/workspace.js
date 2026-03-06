import z from "zod";

export const workspaceCreateSchema = z.object({
    name: z.string().min(1, "Workspace name is required"),
});

export const addMemberToWorkspaceSchema = z.object({
    memberId: z.string()
});

export const addChannelToWorkspaceSchema = z.object({
    channelName: z.string()
});