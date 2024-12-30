import { GeneralMenu } from '../../GeneralMenu';
import { startStageSelection } from '../startStageSelection';
import { startTerrainGeneration } from '../../../terrain/startTerrainGeneration';
import { startCarSelection } from '../startCarSelection';
import { currentMenu, seed, timeOfDay, weather } from '../../../../refs';
import { timeOfDayOptions, weatherOptions } from '../../../../types';
import { categoriseSeedHeight } from '../../../terrain/categoriseSeedHeight';
import { sleep } from '../../../utils/sleep';

export function MainMenu() {
  const today = new Date().toString().slice(0, 15);
  const hash1 = today
    .split('')
    .map((x, i) => x.charCodeAt(0) * i ** 2)
    .reduce((a, b) => a + b, 0);
  const hash2 = today
    .split('')
    .map((x, i) => x.charCodeAt(0) * i)
    .reduce((a, b) => a + b, 0);

  return (
    <GeneralMenu
      onBack={() => {}}
      items={[
        {
          label: `Daily Challenge - ${categoriseSeedHeight(hash1 % 1000)}, ${timeOfDayOptions[hash1 % 3].time}, ${weatherOptions[hash2 % 3]}`,
          async onChoose() {
            timeOfDay.current = timeOfDayOptions[hash1 % 3];
            weather.current = weatherOptions[hash2 % 3];
            seed.current = hash1 % 1000;
            await sleep();
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
        {
          label: 'Settings',
          onChoose() {
            currentMenu.current = 'settings';
          },
        },
      ]}
    />
  );
}
