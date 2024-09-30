import { useEffect, useState } from 'react';
import { MainMenu } from './Menus/MainMenu';
import { currentMenu, transitionTime } from '../../refs';
import { Menu } from '../../types';
import { SplashScreen } from './Menus/SplashScreen';
import styled from 'styled-components';
import { StageSelect } from './Menus/StageSelect';
import { HUD } from './HUD';

export function ReactUI() {
  const [menu, setMenu] = useState<Menu>(currentMenu.current);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    currentMenu.listeners.push(value => {
      setOpacity(0);
      setTimeout(() => {
        setMenu(value);
        setOpacity(1);
      }, transitionTime);
    });
    currentMenu.triggerListeners();
  }, []);

  return (
    <Container
      style={{
        opacity,
      }}
    >
      {menu === 'main' && <MainMenu />}
      {menu === 'splash' && <SplashScreen />}
      {menu === 'stageSelect' && <StageSelect />}
      {menu === 'hud' && <HUD />}
    </Container>
  );
}

const Container = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100svh;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: ${transitionTime}ms;
`;
