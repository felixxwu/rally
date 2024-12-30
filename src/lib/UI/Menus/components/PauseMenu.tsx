import { currentMenu, defaultTransitionTime, stopOnRender, transitionTime } from '../../../../refs';
import { GeneralMenu } from '../../GeneralMenu';
import { resetToLastProgress } from '../../../road/resetIfFarFromRoad';
import { BlurredContainer } from '../styles';
import { exitToMainMenu } from '../exitToMainMenu';

export function PauseMenu() {
  const resume = async () => {
    transitionTime.current = defaultTransitionTime;
    currentMenu.current = 'hud';
    await new Promise(r => setTimeout(r, defaultTransitionTime));
    stopOnRender.current = false;
  };

  return (
    <BlurredContainer>
      <GeneralMenu
        onBack={() => {}}
        items={[
          {
            label: 'Back',
            onChoose: resume,
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
