import {
  currentMenu,
  defaultTransitionTime,
  stopOnRender, transitionTime
} from '../../../refs';
import { GeneralMenu } from '../GeneralMenu';
import { resetToLastProgress } from '../../road/resetIfFarFromRoad';
import { BlurredContainer } from './styles';
import { exitToMainMenu } from './exitToMainMenu';

export function PauseMenu() {
  return (
    <BlurredContainer>
      <GeneralMenu
        onBack={() => {}}
        items={[
          {
            label: 'Resume',
            onChoose: async () => {
              transitionTime.current = defaultTransitionTime;
              currentMenu.current = 'hud';
              await new Promise(r => setTimeout(r, defaultTransitionTime));
              stopOnRender.current = false;
            },
          },
          {
            label: 'Reset to track',
            onChoose: async () => {
              transitionTime.current = defaultTransitionTime;
              currentMenu.current = 'hud';
              await new Promise(r => setTimeout(r, defaultTransitionTime));
              stopOnRender.current = false;
              resetToLastProgress();
            },
          },
          {
            label: 'Settings',
            onChoose() {
              currentMenu.current = 'settings';
            },
          },
          {
            label: 'Quit to Main Menu',
            onChoose: exitToMainMenu,
          },
        ]}
      />
    </BlurredContainer>
  );
}
