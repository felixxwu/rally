import styled from 'styled-components';
import { internalController, onRender } from '../../../refs';
import { useEffect, useState } from 'react';

const joystickPadSize = 200;

export function MobileHUD() {
  const [controller, setController] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    onRender.current.push([
      'mobile joystick',
      () =>
        setController({
          x: internalController.current.steer / 2 + 0.5,
          y: internalController.current.throttle / -2 + 0.5 + internalController.current.brake / 2,
        }),
    ]);
  }, []);

  return (
    <Container>
      <JoyStickPad id='joystick-pad'>
        <XAxis style={{ marginLeft: `${controller.x * joystickPadSize}px` }} />
        <YAxis style={{ marginTop: `${controller.y * joystickPadSize}px` }} />
      </JoyStickPad>
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

const JoyStickPad = styled('div')`
  width: 200px;
  height: 200px;
  background: #fff2;
  outline: 2px solid #fff;
  border-radius: 10px;
  opacity: 0;
  overflow: clip;
`;

const XAxis = styled('div')`
  width: 1px;
  height: ${joystickPadSize}px;
  background: linear-gradient(0deg, #fff0 0%, #ffff 50%, #fff0 100%);
  position: absolute;
`;

const YAxis = styled('div')`
  width: ${joystickPadSize}px;
  height: 1px;
  background: linear-gradient(90deg, #fff0 0%, #ffff 50%, #fff0 100%);
  position: absolute;
`;
