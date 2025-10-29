import styled from 'styled-components';
import { internalController, menuPause, mobileButtons, mobileInput } from '../../../refs';
import { useEffect, useState } from 'react';
import { addOnRenderListener } from '../../render/addOnRenderListener';
import { useCustomRef } from '../../utils/useCustomRef';
import { Hamburger } from '../Icons/Hamburger';

const joystickPadSize = 200;
const smallPadLength = 150;
const smallPadWidth = 50;
const buttonHeight = 70;
const buttonGap = 10; // Uniform gap between buttons and to screen edges
let i = 0;

export function MobileHUD() {
  const [controller, setController] = useState({ x: 0.5, y: 0.5 });
  const inputType = useCustomRef(mobileInput);
  const buttons = useCustomRef(mobileButtons);

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
      {inputType === 'buttons' && (
        <ButtonRow>
          <ControlButton
            id='mobile-button-left'
            pressed={buttons.left}
            onTouchStart={e => {
              e.preventDefault();
              mobileButtons.current.left = true;
            }}
            onTouchEnd={e => {
              e.preventDefault();
              mobileButtons.current.left = false;
            }}
            onMouseDown={e => {
              e.preventDefault();
              mobileButtons.current.left = true;
            }}
            onMouseUp={e => {
              e.preventDefault();
              mobileButtons.current.left = false;
            }}
            onMouseLeave={e => {
              e.preventDefault();
              mobileButtons.current.left = false;
            }}
          >
            ←
          </ControlButton>
          <ControlButton
            id='mobile-button-brake'
            pressed={buttons.brake}
            isBrake
            onTouchStart={e => {
              e.preventDefault();
              mobileButtons.current.brake = true;
            }}
            onTouchEnd={e => {
              e.preventDefault();
              mobileButtons.current.brake = false;
            }}
            onMouseDown={e => {
              e.preventDefault();
              mobileButtons.current.brake = true;
            }}
            onMouseUp={e => {
              e.preventDefault();
              mobileButtons.current.brake = false;
            }}
            onMouseLeave={e => {
              e.preventDefault();
              mobileButtons.current.brake = false;
            }}
          >
            BRAKE
          </ControlButton>
          <ControlButton
            id='mobile-button-right'
            pressed={buttons.right}
            onTouchStart={e => {
              e.preventDefault();
              mobileButtons.current.right = true;
            }}
            onTouchEnd={e => {
              e.preventDefault();
              mobileButtons.current.right = false;
            }}
            onMouseDown={e => {
              e.preventDefault();
              mobileButtons.current.right = true;
            }}
            onMouseUp={e => {
              e.preventDefault();
              mobileButtons.current.right = false;
            }}
            onMouseLeave={e => {
              e.preventDefault();
              mobileButtons.current.right = false;
            }}
          >
            →
          </ControlButton>
        </ButtonRow>
      )}
      <HamburgerContainer id='hamburger' onClick={() => (menuPause.current = true)}>
        <Hamburger size={50} color={'white'} />
      </HamburgerContainer>
    </Container>
  );
}

const Container = styled('div')`
  position: fixed;
  bottom: ${buttonGap}px;
  left: ${buttonGap}px;
  right: ${buttonGap}px;
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

const ButtonRow = styled('div')`
  display: flex;
  gap: ${buttonGap}px;
  width: 100%;
  align-items: stretch;
  justify-content: center;
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

const ControlButton = styled('button')<{ pressed: boolean; isBrake?: boolean }>`
  flex: 1;
  height: ${buttonHeight}px;
  border-radius: 15px;
  border: 3px solid white;
  background: ${({ pressed, isBrake }) =>
    pressed ? (isBrake ? '#ff3333' : '#33ff33') : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  font-size: ${buttonHeight * 0.3}px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  transition: background 0.1s ease;
  outline: none;
  touch-action: none;

  &:active {
    background: ${({ isBrake }) => (isBrake ? '#ff6666' : '#66ff66')};
  }
`;

const HamburgerContainer = styled('div')`
  position: fixed;
  top: 20px;
  right: 20px;
  pointer-events: all;
  cursor: pointer;
`;
