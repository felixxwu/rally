import { useEffect, useRef, useState } from 'react';
import { MainMenu } from './Menus/MainMenu';
import { currentMenu, transitionTime } from '../../refs';
import { Menu } from '../../types';
import { SplashScreen } from './Menus/SplashScreen';
import styled from 'styled-components';
import { StageSelect } from './Menus/StageSelect';
import { HUD } from './HUD';
import { PauseMenu } from './Menus/PauseMenu';
import { SettingsMenu } from './Menus/SettingsMenu';

export function ReactUI() {
  const [menu, setMenu] = useState<Menu>(currentMenu.current);
  const [opacity, setOpacity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentMenu.listeners.push(value => {
      containerRef.current!.style.transition = `${transitionTime.current}ms`;
      setOpacity(0);
      setTimeout(() => {
        setMenu(value);
        setOpacity(1);
      }, transitionTime.current);
    });
    currentMenu.triggerListeners();
  }, []);

  return (
    <>
      <BackgroundCmp style={{ opacity: menu === 'hud' ? 0 : 1 }} />
      <Container
        ref={containerRef}
        style={{
          opacity,
        }}
      >
        {menu === 'main' && <MainMenu />}
        {menu === 'splash' && <SplashScreen />}
        {menu === 'stageSelect' && <StageSelect />}
        {menu === 'hud' && <HUD />}
        {menu === 'pause' && <PauseMenu />}
        {menu === 'settings' && <SettingsMenu />}
      </Container>
    </>
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
`;

const BackgroundCmp = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  transition: opacity ${transitionTime.current}ms;
`;
