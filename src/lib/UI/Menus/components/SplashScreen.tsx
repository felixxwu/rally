import { currentMenu, defaultTransitionTime, transitionTime } from '../../../../refs';
import styled from 'styled-components';
import { useEffect } from 'react';

export function SplashScreen() {
  useEffect(() => {
    setTimeout(() => {
      transitionTime.current = defaultTransitionTime;
      currentMenu.current = 'main';
    }, 3000);
  }, []);

  return (
    <Container>
      <Text>Recommended input device: Gamepad</Text>
      <Img src='/gamepad.svg' />
    </Container>
  );
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  opacity: 0.7;
`;

const Text = styled('div')`
  font-size: 26px;
`;

const Img = styled('img')`
  width: 100px;
`;
