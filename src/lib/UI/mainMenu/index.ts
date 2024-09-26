import { seed, startGame, timeOfDay } from '../../../refs';
import { Container, FullSize, SeedInput, StartButton } from './styles';

export function mainMenu() {
  return FullSize(
    {},
    Container(
      {},
      StartButton(
        {
          oncreate: div => {
            div.onclick = () => {
              startGame.current = true;
            };
          },
        },
        'Start'
      ),
      StartButton({
        oncreate: div => {
          timeOfDay.listeners.push(value => {
            div.textContent = value;
          });
          timeOfDay.triggerListeners();

          div.onclick = () => {
            if (timeOfDay.current === 'Day') {
              timeOfDay.current = 'Sunset';
              return;
            }
            if (timeOfDay.current === 'Sunset') {
              timeOfDay.current = 'Night';
              return;
            }
            if (timeOfDay.current === 'Night') {
              timeOfDay.current = 'Day';
              return;
            }
          };
        },
      }),
      SeedInput({
        type: 'number',
        oncreate: input => {
          const newSeed = Math.round(Math.random() * 1000);
          input.value = newSeed + '';
          seed.current = newSeed;
          input.oninput = e => {
            seed.current = parseInt((e.target as HTMLInputElement).value);
          };
        },
      })
    )
  );
}
