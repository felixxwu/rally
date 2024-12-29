import { MenuItem } from './MenuItem';
import { menuBack, menuDown, menuSelect, menuUp } from '../../../refs';
import { useState } from 'react';
import styled from 'styled-components';
import { useCustomRef } from '../../utils/useCustomRef';
import { Ref } from '../../utils/ref';

// TODO scroll list if selected item is outside of the viewport
export function GeneralMenu({
  items,
  onBack,
  noWrapper,
}: {
  items: {
    label: string;
    onChoose?: () => void;
    cycleValueRef?: Ref<any>;
    cycleSet?: any[];
    numRef?: Ref<number>;
    boolRef?: Ref<boolean>;
    labelFn?: (cycleSet: any[], index: number) => string;
    onCycleChange?: (value: any) => void;
  }[];
  onBack: () => void;
  noWrapper?: boolean;
}) {
  const [selected, setSelected] = useState(0);

  useCustomRef(menuUp, value => {
    if (value) {
      setSelected(selected => Math.max(0, selected - 1));
    }
  });
  useCustomRef(menuDown, value => {
    if (value) {
      setSelected(selected => Math.min(items.length - 1, selected + 1));
    }
  });
  useCustomRef(menuSelect, value => {
    if (value) {
      items[selected].onChoose?.();
    }
  });
  useCustomRef(menuBack, value => {
    if (value) {
      onBack();
    }
  });

  const menuItems = items.map((item, index) => (
    <MenuItem
      key={index}
      selected={index === selected}
      label={item.label}
      onChoose={item.onChoose}
      onHover={() => {
        setSelected(index);
      }}
      cycleValueRef={item.cycleValueRef}
      cycleSet={item.cycleSet}
      labelFn={item.labelFn}
      onCycleChange={item.onCycleChange}
      numberRef={item.numRef}
      booleanRef={item.boolRef}
    />
  ));

  if (noWrapper) {
    return <>{menuItems}</>;
  }

  return (
    <Container>
      <InnerContainer>{menuItems}</InnerContainer>
    </Container>
  );
}

const Container = styled('div')`
  position: fixed;
  width: 100%;
  max-width: 1000px;
  height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  border-left: 5px solid rgba(0, 0, 0, 0.7);
  border-right: 5px solid rgba(0, 0, 0, 0.7);
  background: rgba(255, 255, 255, 0.1);
`;

const InnerContainer = styled('div')`
  max-height: 100svh;
  width: 100%;
  overflow-y: auto;
`;
