import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/database/prisma.service';

describe('database module wiring', () => {
  it('makes PrismaService available from the application module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef.get(PrismaService)).toEqual(
      expect.objectContaining({
        onModuleDestroy: expect.any(Function),
        onModuleInit: expect.any(Function),
      }),
    );
  });
});
