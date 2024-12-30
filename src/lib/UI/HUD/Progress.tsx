import styled from 'styled-components';
import { useCustomRef } from '../../utils/useCustomRef';
import { progress, roadVecs, stageTime, stageTimeStarted, startRoadLength } from '../../../refs';
import { useState } from 'react';
import { padStart } from '../../utils/padStart';
import { setInfoText } from '../setInfoText';

export function Progress() {
  const [timerText, setTimerText] = useState('');
  const [split, setSplit] = useState(0);

  const splitPositions = [25, 50, 75];

  const timerStarted = useCustomRef(stageTimeStarted);

  useCustomRef(stageTime, value => {
    const time = getTimerText(value);
    setTimerText(time);

    if (splitPositions[split] < getProgressPercentage()) {
      setSplit(split + 1);
      setInfoText(`Split: ${time}`, 5000);
    }
  });

  if (!timerStarted) return null;

  return (
    <Container>
      <Split style={{ bottom: `0%` }} />
      <Split style={{ bottom: `25%` }} />
      <Split style={{ bottom: `50%` }} />
      <Split style={{ bottom: `75%` }} />
      <Split style={{ bottom: `100%` }} />
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

const Split = styled('div')`
  position: absolute;
  height: 2px;
  width: 20px;
  left: -5px;
  background-color: white;
`;
