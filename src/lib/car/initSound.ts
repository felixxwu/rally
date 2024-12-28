import { selectedCar, sound, soundOff } from '../../refs';
import { THREE } from '../utils/THREE';

export function setEngineSound() {
  const car = selectedCar.current;

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(`audio/${car.engineSound}`, buffer => {
    sound.current.stop();
    sound.current.setBuffer(buffer);
    sound.current.setLoop(true);
    sound.current.setPlaybackRate(1000 / car.recordedRPM);
    sound.current.play();
    sound.current.setVolume(0);
  });
  audioLoader.load(`audio/${car.engineOffSound}`, buffer => {
    soundOff.current.stop();
    soundOff.current.setBuffer(buffer);
    soundOff.current.setLoop(true);
    soundOff.current.setPlaybackRate(1000 / car.recordedRPM);
    soundOff.current.play();
    soundOff.current.setVolume(car.engineVolume);
  });
}
