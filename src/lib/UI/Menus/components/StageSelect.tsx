import { currentMenu, seed, timeOfDay, weather } from '../../../../refs';
import { timeOfDayOptions, weatherOptions } from '../../../../types';
import { getSeededHeight } from '../../../terrain/getSeededHeight';
import { getSlope } from '../../../terrain/getSlope';
import { startTerrainGeneration } from '../../../terrain/startTerrainGeneration';
import { useCustomRef } from '../../../utils/useCustomRef';
import { GeneralMenu } from '../../GeneralMenu';
import { startCarSelection } from '../startCarSelection';
import { categoriseSeedHeight } from '../../../terrain/categoriseSeedHeight';

export function StageSelect() {
  const currentSeed = useCustomRef(seed, () => {
    const { slopeX, slopeZ } = getSlope();
    console.log(`Seeded Height `, getSeededHeight());
    console.log(`Slope X`, slopeX);
    console.log(`Slope Z`, slopeZ);
  });

  return (
    <GeneralMenu
      onBack={() => (currentMenu.current = 'main')}
      items={[
        {
          label: 'Start Game',
          async onChoose() {
            startCarSelection();
            await startTerrainGeneration();
          },
        },
        { label: `Seed - ${categoriseSeedHeight(currentSeed)}`, numRef: seed },
        {
          label: 'Time of Day',
          cycleValueRef: timeOfDay,
          cycleSet: timeOfDayOptions,
          labelFn: (cycleSet, index) => cycleSet[index].time,
        },
        {
          label: 'Weather',
          cycleValueRef: weather,
          cycleSet: weatherOptions,
        },
        {
          label: 'Back',
          onChoose() {
            currentMenu.current = 'main';
          },
        },
      ]}
    />
  );
}
