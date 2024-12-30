import {
  camFollowDistance,
  camFollowHeight,
  camFollowSpeed,
  currentMenu,
  mobileInput,
  renderHelperArrows,
  renderHitCarBox,
  seed,
  shiftingMode,
  transitionTime,
} from '../../../../refs';
import { GeneralMenu } from '../../GeneralMenu';
import { BlurredContainer } from '../styles';

export function SettingsMenu() {
  return (
    <BlurredContainer>
      <GeneralMenu
        onBack={() => {
          transitionTime.current = 0;
          currentMenu.current = 'pause';
        }}
        items={[
          { label: '[ Inputs ]' },
          { label: 'Gears', cycleValueRef: shiftingMode, cycleSet: ['manual', 'auto'] },
          {
            label: 'Mobile Input Mode',
            cycleValueRef: mobileInput,
            cycleSet: ['combined', 'separate'],
          },

          { label: '[ Camera ]' },
          { label: 'Camera Follow Distance', numRef: camFollowDistance },
          { label: 'Camera Follow Height', numRef: camFollowHeight },
          { label: 'Camera Follow Speed', numRef: camFollowSpeed },

          { label: '[ Debug ]' },
          { label: 'Visualise Forces', boolRef: renderHelperArrows },
          { label: 'Render Car Hitbox', boolRef: renderHitCarBox },

          { label: 'Current Seed: ' + seed.current },
          {
            label: 'Back',
            onChoose: () => (currentMenu.current = 'pause'),
          },
        ]}
      />
    </BlurredContainer>
  );
}
