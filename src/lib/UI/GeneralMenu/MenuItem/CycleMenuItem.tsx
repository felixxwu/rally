import { Container, CycleInput, Text } from '../styles';
import { useCustomRef } from '../../../utils/useCustomRef';
import { menuLeft, menuRight, menuSelect } from '../../../../refs';
import { Ref } from '../../../utils/ref';
import { LeftTriangle } from '../../Icons/LeftTriangle';
import { RightTriangle } from '../../Icons/RightTriangle';

export function CycleMenuItem<T>({
  selected,
  label,
  onHover,
  valueRef,
  cycleSet,
  labelFn,
  onChange,
}: {
  selected: boolean;
  label: string;
  onHover: () => void;
  valueRef: Ref<T>;
  cycleSet: T[];
  labelFn?: (cycleSet: T[], index: number) => string;
  onChange?: (value: T) => void;
}) {
  const value = useCustomRef(valueRef);
  const index = cycleSet.indexOf(value);
  const labelFunction = labelFn || ((cycleSet, index) => cycleSet[index] as string);

  const handleCycle = (step = 1) => {
    const newIndex = (index + step + cycleSet.length) % cycleSet.length;
    valueRef.current = cycleSet[newIndex];
    onChange?.(cycleSet[newIndex]);
  };

  useCustomRef(menuLeft, value => {
    if (value && selected) {
      handleCycle(-1);
    }
  });

  useCustomRef(menuRight, value => {
    if (value && selected) {
      handleCycle();
    }
  });

  useCustomRef(menuSelect, async value => {
    if (value && selected) {
      handleCycle();
    }
  });

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
      onClick={() => handleCycle()}
    >
      <Text>{label}</Text>
      <CycleInput>
        <LeftTriangle size={30} color={selected ? 'white' : 'rgba(0, 0, 0, 0.7)'} />
        <Text>{labelFunction(cycleSet, index)}</Text>
        <RightTriangle size={30} color={selected ? 'white' : 'rgba(0, 0, 0, 0.7)'} />
      </CycleInput>
    </Container>
  );
}
