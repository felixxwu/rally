import { useEffect, useRef, useState } from 'react';
import { MainMenu } from './Menus/components/MainMenu';
import { currentMenu, platformMesh, transitionTime } from '../../refs';
import { Menu } from '../../types';
import { SplashScreen } from './Menus/components/SplashScreen';
import styled from 'styled-components';
import { StageSelect } from './Menus/components/StageSelect';
import { HUD } from './HUD';
import { PauseMenu } from './Menus/components/PauseMenu';
import { SettingsMenu } from './Menus/components/SettingsMenu';
import { StageEnd } from './Menus/components/StageEnd';
import { CarSelect } from './Menus/components/CarSelect';

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

  useEffect(() => {
    platformMesh.current!.visible = menu === 'carSelect';
  }, [menu]);

  return (
    <>
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
        {menu === 'stageEnd' && <StageEnd />}
        {menu === 'carSelect' && <CarSelect />}
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
