import { useEffect, useRef, useState } from 'react';
import { menuLeft, menuRight, menuSelect, stopInternalController } from '../../../../refs';
import { Ref } from '../../../utils/ref';
import { useCustomRef } from '../../../utils/useCustomRef';
import { Container, NumberInput, Text } from '../styles';

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
      await new Promise(r => setTimeout(r));
      input.current?.focus();
    }
  });

  useEffect(() => {
    stopInternalController.current = editmode;
  }, [editmode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) return;

    numberRef.current = Number(e.target.value);
    numberRef.current = Math.max(numberRef.current, numberRef.min ?? -Infinity);
    numberRef.current = Math.min(numberRef.current, numberRef.max ?? Infinity);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditMode(false);
    }
  };

  return (
    <Container
      style={{
        backgroundColor: selected ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
        color: selected ? 'white' : 'rgba(0, 0, 0, 0.7)',
      }}
      onPointerMove={async () => {
        await new Promise(r => setTimeout(r));
        onHover();
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
        />
      ) : (
        <Text>{numberValue}</Text>
      )}
    </Container>
  );
}
