import { z } from 'zod';

export const createWalletSchema = z.object({
    body: z.object({
        owner_id: z.string().min(1, 'owner_id wajib diisi'),
        currency: z.string().length(3, 'currency harus terdiri dari 3 karakter (misal: USD)').toUpperCase(),
    }),
});