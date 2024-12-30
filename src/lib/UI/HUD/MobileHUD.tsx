import styled from 'styled-components';
import { internalController, menuPause, mobileInput } from '../../../refs';
import { useEffect, useState } from 'react';
import { addOnRenderListener } from '../../render/addOnRenderListener';
import { useCustomRef } from '../../utils/useCustomRef';
import { Hamburger } from '../Icons/Hamburger';

const joystickPadSize = 200;
const smallPadLength = 150;
const smallPadWidth = 50;
let i = 0;

export function MobileHUD() {
  const [controller, setController] = useState({ x: 0.5, y: 0.5 });
  const inputType = useCustomRef(mobileInput);

  useEffect(() => {
    addOnRenderListener('mobile joystick', () => {
      if (i++ % 5 === 0) return;
      setController({
        x: internalController.current.steer / 2 + 0.5,
        y: internalController.current.throttle / -2 + 0.5 + internalController.current.brake / 2,
      });
    });
  }, []);

  return (
    <Container>
      {inputType === 'combined' && (
        <JoyStickPad id='joystick-pad' width={joystickPadSize} height={joystickPadSize}>
          <XAxis height={joystickPadSize} pos={controller.x * joystickPadSize} />
          <YAxis width={joystickPadSize} pos={controller.y * joystickPadSize} />
        </JoyStickPad>
      )}
      {inputType === 'separate' && (
        <>
          <HalfContainer>
            <JoyStickPad id='joystick-left' width={smallPadLength} height={smallPadWidth}>
              <XAxis height={smallPadWidth} pos={controller.x * smallPadLength} />
            </JoyStickPad>
          </HalfContainer>
          <HalfContainer>
            <JoyStickPad id='joystick-right' width={smallPadWidth} height={smallPadLength}>
              <YAxis width={smallPadWidth} pos={controller.y * smallPadLength} />
            </JoyStickPad>
          </HalfContainer>
        </>
      )}
      <HamburgerContainer id='hamburger' onClick={() => (menuPause.current = true)}>
        <Hamburger size={50} color={'white'} />
      </HamburgerContainer>
    </Container>
  );
}

const Container = styled('div')`
  position: fixed;
  bottom: 30px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HalfContainer = styled('div')`
  width: 50%;
  height: ${smallPadLength}px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding-right: 30px;
`;

const HamburgerContainer = styled('div')`
  position: fixed;
  top: 20px;
  right: 20px;
  pointer-events: all;
  cursor: pointer;
`;

const JoyStickPad = styled('div')<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background: #fff2;
  outline: 2px solid #fff;
  border-radius: 10px;
  opacity: 0;
  overflow: clip;
`;

const XAxis = styled('div')<{
  height: number;
  pos: number;
}>`
  width: 1px;
  height: ${({ height }) => height}px;
  margin-left: ${({ pos }) => pos}px;
  background: linear-gradient(0deg, #fff0 0%, #ffff 50%, #fff0 100%);
  position: absolute;
`;

const YAxis = styled('div')<{
  width: number;
  pos: number;
}>`
  width: ${({ width }) => width}px;
  margin-top: ${({ pos }) => pos}px;
  height: 1px;
  background: linear-gradient(90deg, #fff0 0%, #ffff 50%, #fff0 100%);
  position: absolute;
`;
