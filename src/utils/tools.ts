export const interval = (fn: any, delay: number) => {
  const interval = function() {
    fn();
    setTimeout(fn, delay);
  };
  setInterval(interval, delay);
};
