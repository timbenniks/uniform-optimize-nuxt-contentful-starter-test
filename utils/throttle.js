export const throttle = (func, delay, immediate) => {
  let timerId;
  return (...args) => {
    const boundFunc = func.bind(this, ...args);
    if (timerId) {
      return;
    }
    if (immediate && !timerId) {
      boundFunc();
    }
    timerId = setTimeout(() => {
      if (!immediate) {
        boundFunc();
      }
      timerId = null;
    }, delay);
  };
};
