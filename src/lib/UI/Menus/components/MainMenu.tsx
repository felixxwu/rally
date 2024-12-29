import { GeneralMenu } from '../../GeneralMenu';
import { startStageSelection } from '../startStageSelection';
import { startTerrainGeneration } from '../../../terrain/startTerrainGeneration';
import { startCarSelection } from '../startCarSelection';
import { seed, timeOfDay, weather } from '../../../../refs';
import { timeOfDayOptions, weatherOptions } from '../../../../types';

export function MainMenu() {
  return (
    <GeneralMenu
      onBack={() => {}}
      items={[
        {
          label: 'Daily Rally',
          async onChoose() {
            const today = new Date().toString().slice(0, 15);
            const hash1 = today
              .split('')
              .map((x, i) => x.charCodeAt(0) * i ** 2)
              .reduce((a, b) => a + b, 0);
            const hash2 = today
              .split('')
              .map((x, i) => x.charCodeAt(0) * i)
              .reduce((a, b) => a + b, 0);
            seed.current = hash1 % 1000;
            timeOfDay.current = timeOfDayOptions[hash1 % 3];
            weather.current = weatherOptions[hash2 % 3];
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
