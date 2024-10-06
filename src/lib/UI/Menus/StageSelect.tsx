import { currentMenu, seed, startGame, timeOfDay } from '../../../refs';
import { TimeOfDay } from '../../../types';
import { getSeededHeight } from '../../terrain/getSeededHeight';
import { getSlope } from '../../terrain/getSlope';
import { useCustomRef } from '../../utils/useCustomRef';
import { GeneralMenu } from '../GeneralMenu';

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
            startGame.current = true;
            currentMenu.current = 'hud';
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
