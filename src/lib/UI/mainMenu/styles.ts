import { css } from 'goober';
import { styled } from '../../utils/styled';

export const FullSize = styled('div')(css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  margin: auto;
`);

export const Container = styled('div')(css`
  width: 100%;
  max-width: 500px;
  height: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`);

export const StartButton = styled('div')(css`
  color: white;
  background-color: black;
  padding: 15px 20px;
  max-width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  margin: 0 10px;
`);

export const SeedInput = styled('input')(css`
  color: white;
  background-color: black;
  padding: 15px 20px;
  max-width: 100%;
  border: none;
  outline: none;
  text-align: center;
  font-size: 18px;
  margin: 0 10px;
`);
