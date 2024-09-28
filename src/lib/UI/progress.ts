import { css } from 'goober';
import { styled } from './styled';
import { progress, roadVecs, startRoadLength } from '../../refs';

export function Progress() {
  return Container(
    {},
    Bar({
      oncreate(bar) {
        progress.listeners.push(value => {
          bar.style.height = `${
            Math.min(1, value / (roadVecs.current.length - startRoadLength - 20)) * 100
          }%`;
        });
      },
    })
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

const Bar = styled('div')(css`
  width: 100%;
  background-color: white;
  box-sizing: border-box;
`);
