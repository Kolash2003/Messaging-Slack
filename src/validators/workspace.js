import z from "zod";

export const workspaceCreateSchema = z.object({
    name: z.string().min(1, "Workspace name is required"),
});