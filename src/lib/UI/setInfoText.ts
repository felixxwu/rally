import { infoText, infoTextOnClick } from '../../refs';

export function setInfoText(text: string, timeout: number = 0, onClick?: () => void) {
  infoText.current = text;
  infoTextOnClick.current = onClick ?? (() => {});

  if (timeout === 0) return;
  setTimeout(() => {
    if (infoText.current === text) {
      infoText.current = '';
      infoTextOnClick.current = () => {};
    }
  }, timeout);
}
