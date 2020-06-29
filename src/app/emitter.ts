type EventsObject = {
  [key: string]: any
}

type EventCallback = (arg?: any[]) => any;

export class Emitter {

  private readonly events: EventsObject;

  constructor() {
    this.events = {};
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach((fn: EventCallback) => fn(...args));
    }
    return this;
  }

  on(event: string, fn: (stream: MediaStream) => void) {
    if (this.events[event]) this.events[event].push(fn);
    else this.events[event] = [fn];
    return this;
  }

  off(event?: string, fn?: EventCallback) {
    if (event && typeof fn === 'function') {
      const listeners = this.events[event];
      const index = listeners.findIndex((_fn: EventCallback) => _fn === fn);
      listeners.splice(index, 1);
    } else if (event) this.events[event] = [];
    return this;
  }
}
