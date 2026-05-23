import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { HealthController } from '../src/common/health.controller';

describe(AppModule.name, () => {
  it('registers the health controller', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef.get(HealthController)).toBeInstanceOf(HealthController);
  });

  it('provides validated application configuration', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef.get(ConfigService).get('port')).toBe(3001);
  });
});
