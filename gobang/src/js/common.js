export class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    addEventListener(eventName, callback) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(callback);
    }

    removeEventListener(eventName, callback) {
        if (!this.listeners[eventName]) { return; }
        if (!callback) {
            delete this.listeners[eventName];
            return;
        }
        this.listeners[eventName].forEach((fn, i)=>{
            if (fn === callback) {
                this.listeners[eventName].splice(i, 1);
                return false;
            }
        });
    }

    trigger(eventName, data) {
        this.listeners[eventName] && this.listeners[eventName].forEach(function(fn) {
            fn(data);
        });
    }
}
