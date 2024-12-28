import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { addOnRenderListener } from '../../render/addOnRenderListener';
import { getRPM } from '../../car/getRPM';
import { useCustomRef } from '../../utils/useCustomRef';
import {
  devMode,
  gear,
  internalController,
  selectedCar,
  shifting,
  sound,
  soundOff,
  stageTimeStarted,
} from '../../../refs';
import { getSpeedVec } from '../../car/getSpeedVec';
import { createXYMap } from '../../utils/createXYMap';

const revCounterSize = 180;
const revCounterThickness = 12;

export function DashBoard() {
  const [rpm, setRpm] = useState(0);
  const currentGear = useCustomRef(gear);
  const speed = getSpeedVec();
  const car = useCustomRef(selectedCar);
  const color = rpm > car.redline * 0.9 ? '#f44' : '#fff';
  const isShifting = useCustomRef(shifting);
  const timerStarted = useCustomRef(stageTimeStarted);

  useEffect(() => {
    addOnRenderListener('dash', () => {
      let currentRpm = getRPM();
      if (currentRpm < car.idleRPM) {
        currentRpm = car.idleRPM + (currentRpm % 100);
      }

      setRpm(currentRpm);

      sound.current.setPlaybackRate(currentRpm / car.recordedRPM);
      soundOff.current.setPlaybackRate(currentRpm / car.recordedRPM);

      const engineOffSound = !!shifting.current || internalController.current.throttle === 0;

      const volumeMap = createXYMap([0, car.engineVolume / 2], [car.redline, car.engineVolume]);
      sound.current.setVolume(engineOffSound ? 0 : volumeMap(currentRpm));
      soundOff.current.setVolume(engineOffSound ? car.engineVolume : 0);
    });
  }, []);

  if (!timerStarted) return null;

  return (
    <Container style={{ color }}>
      <SVG
        width={revCounterSize}
        height={revCounterSize}
        viewBox={`0 0 ${revCounterSize} ${revCounterSize}`}
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
      <Gear>{isShifting ? '-' : currentGear + 1}</Gear>
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
