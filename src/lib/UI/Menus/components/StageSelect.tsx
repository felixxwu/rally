import { currentMenu, seed, timeOfDay } from '../../../../refs';
import { TimeOfDay } from '../../../../types';
import { getSeededHeight } from '../../../terrain/getSeededHeight';
import { getSlope } from '../../../terrain/getSlope';
import { startTerrainGeneration } from '../../../terrain/startTerrainGeneration';
import { useCustomRef } from '../../../utils/useCustomRef';
import { GeneralMenu } from '../../GeneralMenu';
import { startCarSelection } from '../startCarSelection';

export function StageSelect() {
  useCustomRef(seed, () => {
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
          onChoose() {
            startTerrainGeneration();
            startCarSelection();
          },
        },
        { label: 'Seed', numRef: seed },
        {
          label: 'Time of Day',
          cycleValueRef: timeOfDay,
          cycleSet: ['Day', 'Sunset', 'Night'] as TimeOfDay[],
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
