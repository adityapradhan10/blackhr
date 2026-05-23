import { PrismaService } from '../../src/database/prisma.service';

describe(PrismaService.name, () => {
  it('connects and disconnects with Nest module lifecycle', async () => {
    const prismaService = new PrismaService();
    const connect = jest.spyOn(prismaService, '$connect').mockResolvedValue();
    const disconnect = jest.spyOn(prismaService, '$disconnect').mockResolvedValue();

    await prismaService.onModuleInit();
    await prismaService.onModuleDestroy();

    expect(connect).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
