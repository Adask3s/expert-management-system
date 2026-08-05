import {z} from 'zod';

// Schemat walidacji zgodny z obiektem UserRequest zdefiniowanym w OpenAPI
// Zabezpiecza payload wysyłany na POST /users
export const userRequestSchema = z.object({
    firstName: z.string()
        .trim()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name is too long'),

    lastName: z.string()
        .trim()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name is too long'),

    email: z.string()
        .trim()
        .min(1, 'Email is required')
        .email('Invalid email address format'),

    active: z.boolean()
});

// Automatyczne wyprowadzenie typu TypeScript na podstawie schematu Zod
// Dzięki temu nie musimy pisać osobnego interfejsu UserRequest
export type UserRequestFormData = z.infer<typeof userRequestSchema>;