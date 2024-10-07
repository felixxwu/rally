import {
  airResistance,
  bodyRoll,
  brakePower,
  brakeRearBias,
  camFollowDistance,
  camFollowHeight,
  camFollowSpeed,
  currentMenu,
  driveTrain,
  renderHelperArrows,
  renderHitCarBox,
  seed,
  springDamping,
  springLength,
  sprintRate,
  surfaceGrips,
  tireGrip,
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
          { label: 'Tire Grip', numRef: tireGrip },
          { label: 'Spring Length', numRef: springLength },
          { label: 'Spring Stiffness', numRef: sprintRate },
          { label: 'Spring Damping', numRef: springDamping },
          { label: 'Tire Snappiness', numRef: tireSnappiness },

          { label: '[ Engine & Brakes ]' },
          { label: 'Brake Strength', numRef: brakePower },
          { label: 'Brake Bias (Rear)', numRef: brakeRearBias },

          { label: '[ Surfaces ]' },
          { label: 'Tarmac Grip', numRef: surfaceGrips.tarmac.dry },
          { label: 'Grass Grip', numRef: surfaceGrips.grass.dry },

          { label: '[ Car Physics ]' },
          { label: 'Body Roll', numRef: bodyRoll },
          { label: 'Air Resistance', numRef: airResistance },
          { label: 'Drivetrain', cycleSet: ['FWD', 'RWD', 'AWD'], cycleValueRef: driveTrain },

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
