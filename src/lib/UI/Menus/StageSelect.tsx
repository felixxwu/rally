import { currentMenu, seed, startGame, timeOfDay } from '../../../refs';
import { TimeOfDay } from '../../../types';
import { GeneralMenu } from '../GeneralMenu';

export function StageSelect() {
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
