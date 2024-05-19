// EventBus.js
import { provide, inject } from 'vue';

const EventBusSymbol = Symbol();

export function useEventBus() {
  return inject(EventBusSymbol);
}

export function createEventBus() {
  const events = {};

  function on(event, callback) {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(callback);
  }

  function emit(event, ...args) {
    if (events[event]) {
      events[event].forEach(callback => {
        callback(...args);
      });
    }
  }

  provide(EventBusSymbol, {
    on,
    emit
  });
}
