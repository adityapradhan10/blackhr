import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerDocument, setupSwagger } from '../src/swagger';

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    build: jest.fn().mockReturnValue({ title: 'BlackHR API' }),
    setDescription: jest.fn().mockReturnThis(),
    setTitle: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
  })),
  SwaggerModule: {
    createDocument: jest.fn().mockReturnValue({ openapi: '3.0.0' }),
    setup: jest.fn(),
  },
}));

describe('Swagger setup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates the OpenAPI document with the shared API configuration', () => {
    const app = {};

    expect(createSwaggerDocument(app as never)).toEqual({ openapi: '3.0.0' });
    expect(SwaggerModule.createDocument).toHaveBeenCalledWith(app, { title: 'BlackHR API' });
  });

  it('mounts Swagger docs at the API docs route', () => {
    const app = {};

    setupSwagger(app as never);

    expect(SwaggerModule.setup).toHaveBeenCalledWith('api/docs', app, { openapi: '3.0.0' });
  });
});
