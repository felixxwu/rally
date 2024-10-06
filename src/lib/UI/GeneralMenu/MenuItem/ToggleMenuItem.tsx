import { menuSelect } from '../../../../refs';
import { Ref } from '../../../utils/ref';
import { useCustomRef } from '../../../utils/useCustomRef';
import { Container, Text } from '../styles';

export function ToggleMenuItem({
  selected,
  label,
  onHover,
  boolRef,
}: {
  selected: boolean;
  label: string;
  onHover: () => void;
  boolRef: Ref<boolean>;
}) {
  const booleanValue = useCustomRef(boolRef);

  useCustomRef(menuSelect, async value => {
    if (value && selected) {
      handleChange();
    }
  });

  const handleChange = () => {
    boolRef.current = !boolRef.current;
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
      onClick={handleChange}
    >
      <Text>{label}</Text>
      <Text>{booleanValue ? 'On' : 'Off'}</Text>
    </Container>
  );
}
