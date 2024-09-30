import styled from 'styled-components';
import { useCustomRef } from '../../utils/useCustomRef';
import { progress, resetDistance, roadVecs, stageTime, startRoadLength } from '../../../refs';
import { useState } from 'react';

export function Progress() {
  const [timerText, setTimerText] = useState('');

  useCustomRef(stageTime, value => {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    const milliseconds = Math.floor((value % 1) * 1000);

    setTimerText(`${minutes}:${seconds}:${milliseconds}`);
  });

  const progressValue = useCustomRef(progress);
  const roadVecsValue = useCustomRef(roadVecs);

  const getProgressPercentage = () =>
    Math.min(1, (progressValue - resetDistance) / (roadVecsValue.length - startRoadLength)) * 100;

  return (
    <Container>
      <Timer style={{ bottom: `${getProgressPercentage()}%` }}>{timerText}</Timer>
      <Bar style={{ height: `${getProgressPercentage()}%` }} />
    </Container>
  );
}

const Container = styled('div')`
  position: fixed;
  top: 100px;
  left: 30px;
  height: calc(100svh - 200px);
  width: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Timer = styled('div')`
  position: absolute;
  left: 30px;
  color: white;
  font-size: 26px;
  margin-bottom: -10px;
`;

const Bar = styled('div')`
  width: 100%;
  background-color: white;
  box-sizing: border-box;
`;
