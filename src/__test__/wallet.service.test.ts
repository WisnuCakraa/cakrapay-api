import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

jest.mock('../config/database', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

import prisma from '../config/database';
import * as WalletService from '../services/wallet.service';
import { Decimal } from 'decimal.js';

const prismaMock = prisma as any;

describe('Wallet Service Unit Tests', () => {
  const mockWalletA = {
    id: 'uuid-wallet-a',
    owner_id: 'user-1',
    balance: new Decimal(1000),
    currency: 'USD',
    status: 'ACTIVE',
  };

  const mockWalletB = {
    id: 'uuid-wallet-b',
    owner_id: 'user-2',
    balance: new Decimal(500),
    currency: 'USD',
    status: 'ACTIVE',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      return callback(prismaMock);
    });
  });

  describe('topUp()', () => {
    it('should successfully increase balance', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(mockWalletA);
      prismaMock.wallet.update.mockResolvedValue({});
      prismaMock.ledger.create.mockResolvedValue({});

      await WalletService.topUp(mockWalletA.id, 500, 'ref-topup-1');

      expect(prismaMock.wallet.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: mockWalletA.id },
        data: { balance: new Decimal(1500) }
      }));
    });

    it('should throw error when wallet is SUSPENDED', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue({ ...mockWalletA, status: 'SUSPENDED' });

      await expect(WalletService.topUp(mockWalletA.id, 100, 'ref-1'))
        .rejects.toThrow('Wallet sedang ditangguhkan');
    });

    it('should throw error if wallet is not found', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(null);

      await expect(WalletService.topUp('invalid-id', 100, 'ref'))
        .rejects.toThrow('Wallet tidak ditemukan');
    });
  });

  describe('payment()', () => {
    it('should deduct balance when funds are sufficient', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(mockWalletA);
      prismaMock.wallet.update.mockResolvedValue({});
      prismaMock.ledger.create.mockResolvedValue({});

      await WalletService.payment(mockWalletA.id, 200, 'ref-pay-1');

      expect(prismaMock.wallet.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: mockWalletA.id },
        data: { balance: new Decimal(800) }
      }));
    });

    it('should throw error for insufficient balance', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(mockWalletA);

      await expect(WalletService.payment(mockWalletA.id, 5000, 'ref-pay-fail'))
        .rejects.toThrow('Saldo tidak cukup');
    });

    it('should throw error if wallet is not found', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(null);

      await expect(WalletService.payment('invalid-id', 100, 'ref'))
        .rejects.toThrow('Wallet tidak ditemukan');
    });

    it('should throw error when wallet is SUSPENDED', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue({ ...mockWalletA, status: 'SUSPENDED' });

      await expect(WalletService.payment(mockWalletA.id, 100, 'ref'))
        .rejects.toThrow('Wallet sedang ditangguhkan');
    });
  });

  describe('transfer()', () => {
    it('should move funds between wallets', async () => {
      prismaMock.wallet.findUnique
        .mockResolvedValueOnce(mockWalletA)
        .mockResolvedValueOnce(mockWalletB);

      prismaMock.wallet.update.mockResolvedValue({});
      prismaMock.ledger.createMany.mockResolvedValue({});

      await WalletService.transfer(mockWalletA.id, mockWalletB.id, 300, 'ref-trf-1');

      expect(prismaMock.wallet.update).toHaveBeenCalledTimes(2);
    });

    it('should prevent cross-currency transfer', async () => {
      const mockWalletIDR = { ...mockWalletB, currency: 'IDR' };

      prismaMock.wallet.findUnique
        .mockResolvedValueOnce(mockWalletA)
        .mockResolvedValueOnce(mockWalletIDR);

      await expect(WalletService.transfer(mockWalletA.id, mockWalletIDR.id, 100, 'ref-err'))
        .rejects.toThrow('Transfer antar mata uang berbeda belum didukung');
    });

    it('should throw error if sender or receiver is not found', async () => {
      prismaMock.wallet.findUnique
        .mockResolvedValueOnce(mockWalletA)
        .mockResolvedValueOnce(null);

      await expect(WalletService.transfer(mockWalletA.id, 'invalid-id', 100, 'ref-err'))
        .rejects.toThrow('Salah satu wallet tidak ditemukan');
    });

    it('should throw error if sender is SUSPENDED', async () => {
      prismaMock.wallet.findUnique
        .mockResolvedValueOnce({ ...mockWalletA, status: 'SUSPENDED' })
        .mockResolvedValueOnce(mockWalletB);

      await expect(WalletService.transfer(mockWalletA.id, mockWalletB.id, 100, 'ref-err'))
        .rejects.toThrow('Wallet Pengirim sedang ditangguhkan');
    });

    it('should throw error for insufficient sender balance', async () => {
      prismaMock.wallet.findUnique
        .mockResolvedValueOnce(mockWalletA)
        .mockResolvedValueOnce(mockWalletB);

      await expect(WalletService.transfer(mockWalletA.id, mockWalletB.id, 5000, 'ref-err'))
        .rejects.toThrow('Saldo pengirim tidak mencukupi');
    });
  });

  describe('createWallet()', () => {
    it('should create a new wallet if it does not exist', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(null);
      prismaMock.wallet.create.mockResolvedValue(mockWalletA);

      const result = await WalletService.createWallet('user-1', 'USD');

      expect(prismaMock.wallet.create).toHaveBeenCalledWith({
        data: { owner_id: 'user-1', currency: 'USD' }
      });
      expect(result).toEqual(mockWalletA);
    });

    it('should throw error if wallet already exists for the currency', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(mockWalletA);

      await expect(WalletService.createWallet('user-1', 'USD'))
        .rejects.toThrow('User sudah memiliki wallet aktif untuk mata uang USD');
    });
  });

  describe('getWalletById()', () => {
    it('should return wallet data including ledger count', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(mockWalletA);

      const result = await WalletService.getWalletById(mockWalletA.id);

      expect(prismaMock.wallet.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: mockWalletA.id }
      }));
      expect(result).toEqual(mockWalletA);
    });

    it('should throw error if wallet is not found', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(null);

      await expect(WalletService.getWalletById('invalid-id'))
        .rejects.toThrow('Wallet tidak ditemukan');
    });
  });

  describe('getTransactionHistory()', () => {
    it('should return ledger history for the wallet', async () => {
      const mockLedger = [{ id: 'ledger-1', amount: 500 }] as any;

      prismaMock.wallet.findUnique.mockResolvedValue(mockWalletA);
      prismaMock.ledger.findMany.mockResolvedValue(mockLedger);

      const result = await WalletService.getTransactionHistory(mockWalletA.id);

      expect(prismaMock.ledger.findMany).toHaveBeenCalledWith({
        where: { wallet_id: mockWalletA.id },
        orderBy: { created_at: 'desc' },
      });
      expect(result).toEqual(mockLedger);
    });

    it('should throw error if wallet is not found', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(null);

      await expect(WalletService.getTransactionHistory('invalid-id'))
        .rejects.toThrow('Wallet tidak ditemukan');
    });
  });

  describe('updateWalletStatus()', () => {
    it('should update wallet status successfully', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(mockWalletA);
      prismaMock.wallet.update.mockResolvedValue({ ...mockWalletA, status: 'SUSPENDED' } as any);

      await WalletService.updateWalletStatus(mockWalletA.id, 'SUSPENDED');

      expect(prismaMock.wallet.update).toHaveBeenCalledWith({
        where: { id: mockWalletA.id },
        data: { status: 'SUSPENDED' },
      });
    });

    it('should throw error if wallet is not found', async () => {
      prismaMock.wallet.findUnique.mockResolvedValue(null);

      await expect(WalletService.updateWalletStatus('invalid-id', 'SUSPENDED'))
        .rejects.toThrow('Wallet tidak ditemukan');
    });
  });
});