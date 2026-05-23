import { HealthController } from '../../src/common/health.controller';

describe(HealthController.name, () => {
  it('returns API health status', () => {
    const controller = new HealthController();

    expect(controller.getHealth()).toEqual({ status: 'ok' });
  });
});
