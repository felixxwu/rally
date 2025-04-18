import styled from 'styled-components';
import { useCustomRef } from '../../utils/useCustomRef';
import { infoText, infoTextOnClick } from '../../../refs';

export function Info() {
  const text = useCustomRef(infoText);

  if (!text) return null;

  return (
    <Container>
      <Text onClick={() => infoTextOnClick.current()}>{text}</Text>
    </Container>
  );
}

const Container = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 170px 0;
  display: flex;
  justify-content: center;
`;

const Text = styled('div')`
  color: white;
  text-align: center;
  padding: 10px;
  background-color: black;
  opacity: 0.7;
  max-width: 250px;
  width: 100%;
  font-size: 26px;
  pointer-events: all;
  cursor: pointer;
`;
