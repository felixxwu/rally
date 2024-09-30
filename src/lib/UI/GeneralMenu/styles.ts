import styled from 'styled-components';

export const Container = styled('div')`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
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
