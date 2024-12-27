import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { addOnRenderListener } from '../../render/addOnRenderListener';
import { getRPM } from '../../car/getRPM';
import { useCustomRef } from '../../utils/useCustomRef';
import { devMode, gear, selectedCar } from '../../../refs';
import { getSpeedVec } from '../../car/getSpeedVec';

const revCounterSize = 180;
const revCounterThickness = 12;

export function Dash() {
  const [rpm, setRpm] = useState(0);
  const currentGear = useCustomRef(gear);
  const speed = getSpeedVec();
  const car = useCustomRef(selectedCar);
  const color = rpm > car.redline * 0.9 ? '#f44' : '#fff';

  useEffect(() => {
    addOnRenderListener('dash', () => {
      setRpm(getRPM());
    });
  }, []);

  return (
    <Container style={{ color }}>
      <SVG
        width={revCounterSize}
        height={revCounterSize}
        viewBox={`${revCounterSize} ${revCounterSize}`}
      >
        <circle
          cx='50%'
          cy='50%'
          r={`${(revCounterSize - revCounterThickness) / 2}`}
          fill='none'
          strokeWidth={revCounterThickness}
          stroke={color}
          strokeLinecap='round'
          style={{
            strokeDasharray: `${car.redline}`,
            strokeDashoffset: `${car.redline - rpm * (3 / 4)}`,
          }}
          pathLength={car.redline}
        />
      </SVG>
      <Gear>{currentGear + 1}</Gear>
      <RPM>
        {rpm}
        {devMode ? ` (${Math.round(speed.length())})` : ''}
      </RPM>
    </Container>
  );
}

const Container = styled('div')`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-20px);
`;

const Gear = styled('div')`
  position: absolute;
  font-size: 80px;
  transform: translateY(-130px);
`;

const RPM = styled('div')`
  position: absolute;
  font-size: 20px;
  transform: translateY(-90px);
`;

const SVG = styled('svg')`
  position: absolute;
  transform: translateY(-120px) rotate(-225deg);
`;
