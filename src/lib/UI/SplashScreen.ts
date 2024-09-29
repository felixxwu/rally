import { css } from 'goober';
import { styled } from '../utils/styled';
import { currentMenu } from '../../refs';
import { mainMenu } from './mainMenu';

export function SplashScreen() {
  return Container(
    {
      oncreate: async () => {
        await new Promise(resolve => setTimeout(resolve, 4000));
        currentMenu.current = mainMenu();
      },
    },
    'Recommended input device: Gamepad',
    Img({ src: '/gamepad.svg' })
  );
}

const Container = styled('div')(css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 26px;
`);

const Img = styled('img')(css`
  width: 100px;
`);
