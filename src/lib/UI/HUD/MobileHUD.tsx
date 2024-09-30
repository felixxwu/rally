import styled from 'styled-components';

export function MobileHUD() {
  return (
    <Container>
      <div>
        <Button id='mobile-control-a' src='/triangle.svg' style={{ rotate: '-90deg' }} />
        <Button id='mobile-control-d' src='/triangle.svg' style={{ rotate: '90deg' }} />
      </div>
      <div>
        <Button id='mobile-control-s' src='/triangle.svg' style={{ rotate: '180deg' }} />
        <Button id='mobile-control-w' src='/triangle.svg' style={{ rotate: '0deg' }} />
      </div>
    </Container>
  );
}

const Container = styled('div')`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled('img')`
  padding: 10px 0;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  width: 70px;
`;
