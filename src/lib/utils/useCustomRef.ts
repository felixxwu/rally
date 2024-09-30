import { useEffect, useState } from 'react';
import { Ref } from './ref';

export function useCustomRef<T>(ref: Ref<T>, onChange?: (value: T) => void) {
  const [state, setState] = useState(ref.current);

  useEffect(() => {
    ref.listeners.push((value, changed) => {
      if (changed) {
        setState(value);
      }
    });
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(state);
    }
  }, [state]);

  return state;
}
