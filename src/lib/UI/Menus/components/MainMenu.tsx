import { currentMenu } from '../../../../refs';
import { GeneralMenu } from '../../GeneralMenu';

export function MainMenu() {
  return (
    <GeneralMenu
      onBack={() => {}}
      items={[
        {
          label: 'Select Stage',
          onChoose() {
            currentMenu.current = 'stageSelect';
          },
        },
      ]}
    />
  );
}
