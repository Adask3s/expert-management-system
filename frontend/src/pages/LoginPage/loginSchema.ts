import {z} from 'zod';

export const loginSchema = z.object({
    email: z.string()
        .min(1, "Adres e-mail jest wymagany")
        .email("Niepoprawny format adresu e-mail"),
    password: z.string()
        .min(1, "Hasło jest wymagane")
});

export type LoginFormInputs = z.infer<typeof loginSchema>;