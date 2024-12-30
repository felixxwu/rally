import React, { useEffect, useRef, useState } from 'react';
import { menuLeft, menuRight, menuSelect, stopInternalController } from '../../../../refs';
import { Ref } from '../../../utils/ref';
import { useCustomRef } from '../../../utils/useCustomRef';
import { Container, NumberInput, Text } from '../styles';
import { sleep } from '../../../utils/sleep';

export function NumberMenuItem({
  selected,
  label,
  onHover,
  numberRef,
}: {
  selected: boolean;
  label: string;
  onHover: () => void;
  numberRef: Ref<number>;
}) {
  const [editmode, setEditMode] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const numberValue = useCustomRef(numberRef);

  useCustomRef(menuLeft, value => {
    if (value && selected) {
      numberRef.current -= numberRef.step ?? 1;
      numberRef.current = Math.max(numberRef.current, numberRef.min ?? -Infinity);
      numberRef.current = Math.min(numberRef.current, numberRef.max ?? Infinity);
    }
  });

  useCustomRef(menuRight, value => {
    if (value && selected) {
      numberRef.current += numberRef.step ?? 1;
      numberRef.current = Math.max(numberRef.current, numberRef.min ?? -Infinity);
      numberRef.current = Math.min(numberRef.current, numberRef.max ?? Infinity);
    }
  });

  useCustomRef(menuSelect, async value => {
    if (value && selected) {
      setEditMode(true);
      await sleep();
      input.current?.focus();
    }
  });

  useEffect(() => {
    stopInternalController.current = editmode;
    window.addEventListener('keydown', handleMenuKeyDown);

    if (!editmode) {
      numberRef.current = Math.max(numberRef.current, numberRef.min ?? -Infinity);
      numberRef.current = Math.min(numberRef.current, numberRef.max ?? Infinity);
    }
    return () => {
      stopInternalController.current = false;
      window.removeEventListener('keydown', handleMenuKeyDown);
    };
  }, [editmode, selected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) return;

    numberRef.current = Number(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditMode(false);
    }
  };

  const handleMenuKeyDown = async (e: KeyboardEvent) => {
    if ('0123456789'.includes(e.key) && selected && !editmode) {
      numberRef.current = Number(e.key);
      setEditMode(true);
      await sleep();
      input.current?.focus();
    }
  };

  return (
    <Container
      style={{
        backgroundColor: selected ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
        color: selected ? 'white' : 'rgba(0, 0, 0, 0.7)',
      }}
      onPointerMove={async () => {
        await sleep();
        onHover();
      }}
      onClick={async () => {
        setEditMode(true);
        await sleep();
        input.current?.focus();
      }}
    >
      <Text>{label}</Text>
      {editmode ? (
        <NumberInput
          ref={input}
          type='text'
          value={numberValue}
          onInput={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditMode(false)}
        />
      ) : (
        <Text>{numberValue}</Text>
      )}
    </Container>
  );
}
