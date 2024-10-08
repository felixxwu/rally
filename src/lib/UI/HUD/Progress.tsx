import styled from 'styled-components';
import { useCustomRef } from '../../utils/useCustomRef';
import {
  progress,
  resetDistance,
  roadVecs,
  stageTime,
  stageTimeStarted,
  startRoadLength,
} from '../../../refs';
import { useState } from 'react';
import { padStart } from '../../utils/padStart';

export function Progress() {
  const [timerText, setTimerText] = useState('');

  const timerStarted = useCustomRef(stageTimeStarted);

  useCustomRef(stageTime, value => {
    setTimerText(getTimerText(value));
  });

  if (!timerStarted) return null;

  return (
    <Container>
      <Timer style={{ bottom: `${getProgressPercentage()}%` }}>{timerText}</Timer>
      <Bar style={{ height: `${getProgressPercentage()}%` }} />
    </Container>
  );
}

export function getProgressPercentage() {
  return (
    Math.min(
      1,
      (progress.current - startRoadLength) / (roadVecs.current.length - startRoadLength * 2)
    ) * 100
  );
}

export function getTimerText(stageTime: number) {
  const minutes = Math.floor(stageTime / 60);
  const seconds = Math.floor(stageTime % 60);
  const milliseconds = Math.floor((stageTime % 1) * 1000);

  return `${minutes}:${padStart(seconds.toString(), 2, '0')}:${padStart(
    milliseconds.toString(),
    3,
    '0'
  )}`;
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
