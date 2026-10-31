import { jest } from '@jest/globals';

export function installResizeObserverMock() {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver');
  const instances = [];

  class MockResizeObserver {
    constructor(callback) {
      this.callback = callback;
      this.observe = jest.fn();
      this.disconnect = jest.fn();
      instances.push(this);
    }
  }

  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    value: MockResizeObserver,
  });

  return {
    instances,
    resize(width, height) {
      instances.forEach((observer) => observer.callback([{ contentRect: { width, height } }]));
    },
    restore() {
      if (original) Object.defineProperty(globalThis, 'ResizeObserver', original);
      else delete globalThis.ResizeObserver;
    },
  };
}
