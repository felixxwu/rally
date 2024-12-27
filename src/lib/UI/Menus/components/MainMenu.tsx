import { GeneralMenu } from '../../GeneralMenu';
import { startStageSelection } from '../startStageSelection';

export function MainMenu() {
  return (
    <GeneralMenu
      onBack={() => {}}
      items={[
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
