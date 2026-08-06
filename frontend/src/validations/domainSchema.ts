import {z} from 'zod';

export const domainRequestSchema = z.object({
    name: z.string()
        .trim()
        .min(2, 'Domain name must be at least 2 characters')
        .max(50, 'Domain name is too long'),

    // Opis jest opcjonalny (zgodnie z kontraktem OpenAPI)
    description: z.string()
        .trim()
        .max(255, 'Description is too long')
        .optional()
        .or(z.literal('')) // Pozwala na przesłanie pustego stringa jako braku opisu
});

export type DomainRequestFormData = z.infer<typeof domainRequestSchema>;