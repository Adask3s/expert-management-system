import {z} from 'zod';

export const loginSchema = z.object({
    email: z.string()
        .min(1, "Email adress is required")
        .email("Invalid email format"),
    password: z.string()
        .min(1, "Password is required")
});

export type LoginFormInputs = z.infer<typeof loginSchema>;