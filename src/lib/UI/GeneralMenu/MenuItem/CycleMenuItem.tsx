import { Container, Text } from '../styles';
import { useCustomRef } from '../../../utils/useCustomRef';
import { menuLeft, menuRight, menuSelect } from '../../../../refs';
import { Ref } from '../../../utils/ref';

export function CycleMenuItem({
  selected,
  label,
  onHover,
  valueRef,
  cycleSet,
  onCycleSelect,
}: {
  selected: boolean;
  label: string;
  onHover: () => void;
  valueRef: Ref<string>;
  cycleSet: string[];
  onCycleSelect: (value: string) => void;
}) {
  const value = useCustomRef(valueRef);
  const index = cycleSet.indexOf(value);

  const handleCycle = (step = 1) => {
    const newIndex = (index + step + cycleSet.length) % cycleSet.length;
    onCycleSelect(cycleSet[newIndex]);
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
      <Text>{cycleSet[index]}</Text>
    </Container>
  );
}
