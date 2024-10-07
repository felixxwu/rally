import {
  camFollowDistance,
  camFollowHeight,
  camFollowSpeed,
  currentMenu,
  renderHelperArrows,
  renderHitCarBox,
  seed,
  surfaceGrips,
  tireSnappiness,
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
          { label: '[ Tires & Suspension ]' },
          { label: 'Tire Snappiness', numRef: tireSnappiness },

          { label: '[ Surfaces ]' },
          { label: 'Tarmac Grip', numRef: surfaceGrips.tarmac.dry },
          { label: 'Grass Grip', numRef: surfaceGrips.grass.dry },

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
