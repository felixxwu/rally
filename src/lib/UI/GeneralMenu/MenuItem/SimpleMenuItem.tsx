import { Container, Text } from '../styles';
import { sleep } from '../../../utils/sleep';

export function SimpleMenuItem({
  selected,
  label,
  onHover,
  onChoose,
}: {
  selected: boolean;
  label: string;
  onHover: () => void;
  onChoose?: () => void;
}) {
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
      onClick={onChoose}
    >
      <Text>{label}</Text>
    </Container>
  );
}
