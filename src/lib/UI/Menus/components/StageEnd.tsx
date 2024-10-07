import { stageTime } from '../../../../refs';
import { GeneralMenu } from '../../GeneralMenu';
import { getTimerText } from '../../HUD/Progress';
import { exitToMainMenu } from '../exitToMainMenu';

export function StageEnd() {
  return (
    <GeneralMenu
      onBack={() => {}}
      items={[
        {
          label: 'Final Time: ' + getTimerText(stageTime.current),
        },
        {
          label: 'Exit to Main Menu',
          onChoose: exitToMainMenu,
        },
      ]}
    />
  );
}
