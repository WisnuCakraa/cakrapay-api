import { z } from 'zod';

export const createWalletSchema = z.object({
  body: z.object({
    owner_id: z.string().min(1, 'owner_id wajib diisi'),
    currency: z
      .string()
      .length(3, 'currency harus terdiri dari 3 karakter (misal: USD)')
      .toUpperCase(),
  }),
});

export const topUpSchema = z.object({
  params: z.object({
    id: z.uuid('ID Wallet tidak valid'),
  }),
  body: z.object({
    amount: z.number().positive('Jumlah top-up harus lebih dari 0'),
    reference_id: z
      .string()
      .min(1, 'reference_id wajib ada untuk mencegah duplikasi'),
  }),
});
