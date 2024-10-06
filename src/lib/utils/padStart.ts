export function padStart(input: string, targetLength: number, padString: string) {
  targetLength = Math.floor(targetLength) || 0;
  if (targetLength < input.length) return input;

  padString = padString ? padString : ' ';

  var pad = '';
  var len = targetLength - input.length;
  var i = 0;
  while (pad.length < len) {
    if (!padString[i]) {
      i = 0;
    }
    pad += padString[i];
    i++;
  }

  return pad + input.slice(0);
}
