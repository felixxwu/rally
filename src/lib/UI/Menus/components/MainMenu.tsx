import { currentMenu } from '../../../../refs';
import { GeneralMenu } from '../../GeneralMenu';
import { startStageSelection } from '../startStageSelection';

export function MainMenu() {
  return (
    <GeneralMenu
      onBack={() => {}}
      items={[
        {
          label: 'Select Stage',
          onChoose() {
            startStageSelection();
          },
        },
      ]}
    />
  );
}
