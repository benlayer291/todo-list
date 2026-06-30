import { describe, it, expect } from 'vitest';

describe('test environment', () => {
  it('runs in a DOM environment with a document', () => {
    expect(typeof document).toBe('object');
    expect(document.createElement('div').tagName).toBe('DIV');
  });

  it('provides a working localStorage', () => {
    localStorage.setItem('smoke', 'ok');
    expect(localStorage.getItem('smoke')).toBe('ok');
  });

  it('clears localStorage between tests', () => {
    expect(localStorage.getItem('smoke')).toBeNull();
  });
});
