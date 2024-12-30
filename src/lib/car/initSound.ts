import { grassSound, gravelSound, skidSound, tarmacSound, wheelSurfaces } from '../../refs';
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

    let tarmacVolume = 0;
    let grassVolume = 0;
    let gravelVolume = 0;
    wheelSurfaces.current.forEach(surface => {
      if (surface === 'tarmac') tarmacVolume += 0.25;
      if (surface === 'grass') grassVolume += 0.25;
    });

    const soundXYMap = createXYMap([0, 0], [20, 1]);

    tarmacSound.current.setVolume(tarmacVolume * soundXYMap(speed.length()));
    grassSound.current.setVolume(grassVolume * soundXYMap(speed.length()));
    gravelSound.current.setVolume(gravelVolume * soundXYMap(speed.length()));

    // if (carVisible.current) {
    //   tarmacSound.current.play();
    //   grassSound.current.play();
    //   gravelSound.current.play();
    // }
  });
}
