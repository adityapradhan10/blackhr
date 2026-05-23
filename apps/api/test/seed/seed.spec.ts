import { seedEmployees, type SeedPrismaClient } from '../../prisma/seed/seed';

describe(seedEmployees.name, () => {
  it('clears existing employees and inserts generated employees in batches', async () => {
    const createMany = jest.fn().mockResolvedValueOnce({ count: 2 }).mockResolvedValueOnce({ count: 1 });
    const deleteMany = jest.fn().mockResolvedValue({ count: 4 });
    const prisma = {
      employee: {
        createMany,
        deleteMany,
      },
    } satisfies SeedPrismaClient;
    const generator = {
      generateEmployees: jest
        .fn()
        .mockReturnValueOnce([{ employeeId: 'BHR-00001' }, { employeeId: 'BHR-00002' }])
        .mockReturnValueOnce([{ employeeId: 'BHR-00003' }]),
    };

    const insertedCount = await seedEmployees({
      batchSize: 2,
      employeeCount: 3,
      generator,
      prisma,
    });

    expect(deleteMany).toHaveBeenCalledTimes(1);
    expect(generator.generateEmployees).toHaveBeenNthCalledWith(1, 2, 0);
    expect(generator.generateEmployees).toHaveBeenNthCalledWith(2, 1, 2);
    expect(createMany).toHaveBeenNthCalledWith(1, {
      data: [{ employeeId: 'BHR-00001' }, { employeeId: 'BHR-00002' }],
    });
    expect(createMany).toHaveBeenNthCalledWith(2, {
      data: [{ employeeId: 'BHR-00003' }],
    });
    expect(insertedCount).toBe(3);
  });
});
