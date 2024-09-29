import { css } from 'goober';
import { styled } from '../../utils/styled';
import { progress, resetDistance, roadVecs, stageTime, startRoadLength } from '../../../refs';

export function Progress() {
  return Container(
    {},
    Timer({
      oncreate(timer) {
        stageTime.listeners.push(value => {
          const minutes = Math.floor(value / 60);
          const seconds = Math.floor(value % 60);
          const milliseconds = Math.floor((value % 1) * 1000);

          timer.textContent = `${minutes}:${seconds}:${milliseconds}`;
          timer.style.bottom = `${getProgressPercentage()}%`;
        });
      },
    }),
    Bar({
      oncreate(bar) {
        progress.listeners.push(value => {
          bar.style.height = `${getProgressPercentage()}%`;
        });
      },
    })
  );
}

export function getProgressPercentage() {
  return (
    Math.min(
      1,
      (progress.current - resetDistance) / (roadVecs.current.length - resetDistance * 2)
    ) * 100
  );
}

const Container = styled('div')(css`
  position: fixed;
  top: 100px;
  left: 30px;
  height: calc(100svh - 200px);
  width: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`);

const Timer = styled('div')(css`
  position: absolute;
  left: 30px;
  color: white;
  font-size: 26px;
  margin-bottom: -10px;
`);

const Bar = styled('div')(css`
  width: 100%;
  background-color: white;
  box-sizing: border-box;
`);
