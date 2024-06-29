import React from 'react';

export const useThrottle = <IN>(fn: (input: IN) => any, interval = 500) => {
  const timestamp = React.useRef<number | null>(null);
  const timeoutId = React.useRef<NodeJS.Timeout | null>(null);

  const resetAndRunFn = (input: IN) => {
    timeoutId.current = null;
    timestamp.current = null;
    fn(input);
  };

  const throttledFn = (input: IN) => {
    timeoutId.current && clearTimeout(timeoutId.current);

    if (!timestamp.current) {
      timestamp.current = new Date().getTime();
      timeoutId.current = setTimeout(() => resetAndRunFn(input), interval);
    } else {
      const now = new Date().getTime();
      const elapse = now - timestamp.current;

      if (interval > elapse) {
        timeoutId.current = setTimeout(
          () => resetAndRunFn(input),
          interval - elapse
        );
      } else {
        resetAndRunFn(input);
      }
    }
  };

  return throttledFn;
};
