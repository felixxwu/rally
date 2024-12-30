import {
  carVisible,
  grassSound,
  gravelSound,
  skidMarkOpacities,
  skidSound,
  stageTimeStarted,
  suspensionForces,
  tarmacSound,
  wheelSurfaces,
} from '../../refs';
import { THREE } from '../utils/THREE';
import { addOnRenderListener } from '../render/addOnRenderListener';
import { getSpeedVec } from './getSpeedVec';
import { createXYMap } from '../utils/createXYMap';

export function initSound() {
  const audioLoader = new THREE.AudioLoader();

  audioLoader.load(`audio/tarmac.mp3`, buffer => {
    tarmacSound.current.setBuffer(buffer);
    tarmacSound.current.setLoop(true);
  });
  audioLoader.load(`audio/grass.mp3`, buffer => {
    grassSound.current.setBuffer(buffer);
    grassSound.current.setLoop(true);
  });
  audioLoader.load(`audio/gravel.mp3`, buffer => {
    gravelSound.current.setBuffer(buffer);
    gravelSound.current.setLoop(true);
  });
  audioLoader.load(`audio/skid.mp3`, buffer => {
    skidSound.current.setBuffer(buffer);
    skidSound.current.setLoop(true);
  });

  addOnRenderListener('wheel sounds', () => {
    const speed = getSpeedVec();

    const soundXYMap = createXYMap([0, 0], [40, 1]);
    const forceXYMap = createXYMap([0, 0], [70, 1]);

    let tarmacVolume = 0;
    let grassVolume = 0;
    let gravelVolume = 0;
    wheelSurfaces.current.forEach((surface, i) => {
      const force = suspensionForces.current[i];
      if (surface === 'tarmac') tarmacVolume += 0.25 * forceXYMap(force);
      if (surface === 'grass') grassVolume += 0.25 * forceXYMap(force);
    });

    tarmacSound.current.setVolume(tarmacVolume * soundXYMap(speed.length()) * 2);
    grassSound.current.setVolume(grassVolume * soundXYMap(speed.length()) * 0.6);
    gravelSound.current.setVolume(gravelVolume * soundXYMap(speed.length()));

    if (carVisible.current && stageTimeStarted.current) {
      if (!tarmacSound.current.isPlaying) tarmacSound.current.play();
      if (!grassSound.current.isPlaying) grassSound.current.play();
      if (!gravelSound.current.isPlaying) gravelSound.current.play();
      if (!skidSound.current.isPlaying) skidSound.current.play();
    } else {
      tarmacSound.current.stop();
      grassSound.current.stop();
      gravelSound.current.stop();
      skidSound.current.stop();
    }

    let skidVolume = 0;
    skidMarkOpacities.current.forEach((opacity, i) => {
      const surface = wheelSurfaces.current[i];
      if (opacity < 0.01 || surface !== 'tarmac') return;

      skidVolume += opacity;
    });
    skidSound.current.setVolume(Math.min(0.5, skidVolume) * 3);
  });
}
