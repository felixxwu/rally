import styled from 'styled-components';

export const Container = styled('div')`
  width: 100%;
  height: 50px;
  min-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  pointer-events: all;
`;

export const Text = styled('div')`
  padding: 0 20px;
  font-size: 24px;
`;

export const NumberInput = styled('input')`
  padding: 0 20px;
  font-size: 24px;
  width: 100px;
  text-align: right;
  border: none;
  background-color: transparent;
  outline: none;
  color: white;
`;

export const CycleInput = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;
