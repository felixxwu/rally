import { GeneralMenu } from '../../GeneralMenu';
import { startStageSelection } from '../startStageSelection';
import { startTerrainGeneration } from '../../../terrain/startTerrainGeneration';
import { startCarSelection } from '../startCarSelection';
import { seed, timeOfDay } from '../../../../refs';
import { timeOfDayOptions } from '../../../../types';

export function MainMenu() {
  return (
    <GeneralMenu
      onBack={() => {}}
      items={[
        {
          label: 'Daily Rally',
          async onChoose() {
            const today = new Date().toString().slice(0, 15);
            const hash = today
              .split('')
              .map((x, i) => x.charCodeAt(0) * i ** 2)
              .reduce((a, b) => a + b, 0);
            seed.current = hash % 1000;
            timeOfDay.current = timeOfDayOptions[hash % 3];
            startCarSelection();
            await startTerrainGeneration();
          },
        },
        {
          label: 'Custom Rally',
          onChoose() {
            startStageSelection();
          },
        },
      ]}
    />
  );
}
