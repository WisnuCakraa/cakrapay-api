import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from '../config/database';

jest.mock('../config/database', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
    mockReset(prismaMock);
});

afterAll(async () => {
    await prisma.$disconnect();
});