import { selectedCar, sound } from '../../refs';
import { THREE } from '../utils/THREE';

export function setEngineSound() {
  const car = selectedCar.current;

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(`audio/${car.engineSound}`, buffer => {
    sound.current.stop();
    sound.current.setBuffer(buffer);
    sound.current.setLoop(true);
    sound.current.setVolume(0.5);
    // sound.current.play();
  });
}
