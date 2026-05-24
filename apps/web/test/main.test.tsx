import { beforeEach, describe, expect, it, vi } from 'vitest';

const reactDomClientMock = vi.hoisted(() => ({
  createRoot: vi.fn(),
  render: vi.fn(),
}));

vi.mock('react-dom/client', () => ({
  createRoot: reactDomClientMock.createRoot,
}));

vi.mock('../src/App', () => ({
  App: () => null,
}));

describe('main entrypoint', () => {
  beforeEach(() => {
    vi.resetModules();
    reactDomClientMock.createRoot.mockReturnValue({
      render: reactDomClientMock.render,
    });
    reactDomClientMock.createRoot.mockClear();
    reactDomClientMock.render.mockClear();
    document.body.innerHTML = '';
  });

  it('mounts the app into the root element', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('../src/main');

    expect(reactDomClientMock.createRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(reactDomClientMock.render).toHaveBeenCalledOnce();
  });

  it('fails fast when the root element is missing', async () => {
    await expect(import('../src/main')).rejects.toThrow('Root element not found');
  });
});
