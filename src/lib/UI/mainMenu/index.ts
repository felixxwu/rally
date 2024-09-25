import { seed, startGame } from '../../../refs';
import { el } from '../el';
import { Container, FullSize, SeedInput, StartButton } from './styles';

export function mainMenu() {
  return el.div(
    { style: FullSize },
    el.div(
      { style: Container },
      el.div(
        {
          style: StartButton,
          oncreate: div => {
            div.onclick = () => {
              startGame.current = true;
            };
          },
        },
        'Start'
      ),
      el.input({
        style: SeedInput,
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
