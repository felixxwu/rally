export type XYMap = (x: number) => number;

export function createXYMap(...points: [number, number][]) {
  const map: XYMap = x => {
    for (let i = 0; i < points.length - 1; i++) {
      const point = points[i];
      const nextPoint = points[i + 1];
      // values before first point
      if (x <= point[0]) return point[1];

      // values after last point
      if (x >= points[points.length - 1][0]) return points[points.length - 1][1];

      // interpolate between points
      if (x >= point[0] && x <= nextPoint[0]) {
        const x1 = point[0];
        const y1 = point[1];
        const x2 = nextPoint[0];
        const y2 = nextPoint[1];
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - m * x1;
        return m * x + b;
      }
    }

    return 0;
  };

  return map;
}

const map1 = createXYMap([0, 0], [0.1, 1], [1, 0.8]);
if (map1(-1) !== 0) console.error('assert error, got: ', map1(0));
if (map1(0) !== 0) console.error('assert error, got: ', map1(0));
if (map1(0.05) !== 0.5) console.error('assert error, got: ', map1(0.05));
if (map1(0.1) !== 1) console.error('assert error, got: ', map1(0.1));
if (map1(0.5) !== 0.9111111111111111) console.error('assert error, got:', map1(0.5));
if (map1(1) !== 0.8) console.error('assert error, got:', map1(1));
if (map1(2) !== 0.8) console.error('assert error, got:', map1(1));
