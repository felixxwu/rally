import styled from 'styled-components';
import { currentMenu, generatingTerrain, carSelected, selectedCar } from '../../../../refs';
import { startCountdown } from '../startCountdown';
import { Info } from '../../HUD/Info';
import { MiniMap } from '../../HUD/MiniMap';
import { allCars, selectCar } from '../../../carList';
import { GeneralMenu } from '../../GeneralMenu';
import { useCustomRef } from '../../../utils/useCustomRef';
import { startStageSelection } from '../startStageSelection';

export function CarSelect() {
  const handleStart = () => {
    if (generatingTerrain.current) {
      carSelected.current = true;
      currentMenu.current = 'hud';
    } else {
      startCountdown();
    }
  };

  const car = useCustomRef(selectedCar);

  return (
    <Container>
      <MiniMap />
      <Info />
      <Bottom>
        <InfoContainer>
          <div>Engine Power: {car.power} HP</div>
          <div>Mass: {Math.round(car.mass * 100)} kg</div>
          <div>Drivetrain: {car.driveTrain}</div>
        </InfoContainer>
        <GeneralMenu
          items={[
            {
              label: 'Change Car:',
              cycleSet: allCars,
              cycleValueRef: selectedCar,
              labelFn: (cycleSet, index) => cycleSet[index].name,
              onCycleChange: value => selectCar(value),
            },
            {
              label: 'Start',
              onChoose: handleStart,
            },
          ]}
          onBack={() => {
            startStageSelection();
          }}
          noWrapper
        />
      </Bottom>
    </Container>
  );
}

const Container = styled('div')`
  height: 100%;
  display: flex;
`;

const Bottom = styled('div')`
  width: 100vw;
  max-width: 1000px;
  margin-top: auto;
  margin-bottom: 20px;
`;

const InfoContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;

  & > div {
    color: rgba(0, 0, 0, 0.7);
    font-size: 24px;
    padding: 10px 20px;
  }
`;
