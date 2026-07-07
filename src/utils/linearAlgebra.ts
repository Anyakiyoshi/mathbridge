// Linear Algebra utilities: matrix operations, eigenvalues, etc.

export type Matrix2D = [[number, number], [number, number]];
export type Vector2D = [number, number];

export function mat2dMult(m: Matrix2D, v: Vector2D): Vector2D {
  return [m[0][0] * v[0] + m[0][1] * v[1], m[1][0] * v[0] + m[1][1] * v[1]];
}

export function matMatMul(a: Matrix2D, b: Matrix2D): Matrix2D {
  return [
    [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
    [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
  ];
}

export function determinant(m: Matrix2D): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

export function trace(m: Matrix2D): number {
  return m[0][0] + m[1][1];
}

export function rank(m: Matrix2D): number {
  const det = determinant(m);
  if (Math.abs(det) > 1e-10) return 2;
  const hasNonZero =
    Math.abs(m[0][0]) > 1e-10 ||
    Math.abs(m[0][1]) > 1e-10 ||
    Math.abs(m[1][0]) > 1e-10 ||
    Math.abs(m[1][1]) > 1e-10;
  return hasNonZero ? 1 : 0;
}

export interface EigenResult {
  real: boolean;
  eigenvalues: [number, number]; // if real: [λ1,λ2]; if complex: [real, imag] (λ = real ± i*imag)
  eigenvectors: [Vector2D, Vector2D] | null;
}

export function eigen2x2(m: Matrix2D): EigenResult {
  const tr = trace(m);
  const det = determinant(m);
  const discriminant = tr * tr - 4 * det;

  if (discriminant >= 0) {
    const sqrtD = Math.sqrt(discriminant);
    const lambda1 = (tr + sqrtD) / 2;
    const lambda2 = (tr - sqrtD) / 2;
    const ev1 = eigenvectorForLambda(m, lambda1);
    const ev2 = eigenvectorForLambda(m, lambda2);
    return { real: true, eigenvalues: [lambda1, lambda2], eigenvectors: [ev1, ev2] };
  }
  return {
    real: false,
    eigenvalues: [tr / 2, Math.sqrt(-discriminant) / 2],
    eigenvectors: null,
  };
}

function eigenvectorForLambda(m: Matrix2D, lambda: number): Vector2D {
  const a = m[0][0] - lambda;
  const b = m[0][1];
  if (Math.abs(a) < 1e-10 && Math.abs(b) < 1e-10) return [1, 0];
  if (Math.abs(b) > 1e-10) {
    const x = 1, y = -a / b;
    const norm = Math.hypot(x, y);
    return [x / norm, y / norm];
  }
  return [0, 1];
}

export function rotationMatrix(theta: number): Matrix2D {
  return [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]];
}

export function scaleMatrix(sx: number, sy: number): Matrix2D {
  return [[sx, 0], [0, sy]];
}

export function shearMatrix(k: number): Matrix2D {
  return [[1, k], [0, 1]];
}

export function projectionMatrix(angle: number): Matrix2D {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [[c * c, c * s], [c * s, s * s]];
}

export function reflectionMatrix(angle: number): Matrix2D {
  const c = Math.cos(2 * angle), s = Math.sin(2 * angle);
  return [[c, s], [s, -c]];
}

export function generateGridPoints(
  xMin: number, xMax: number, yMin: number, yMax: number, step: number
): { hLines: Vector2D[][]; vLines: Vector2D[][] } {
  const hLines: Vector2D[][] = [];
  const vLines: Vector2D[][] = [];
  for (let y = yMin; y <= yMax + step / 2; y += step) {
    const line: Vector2D[] = [];
    for (let x = xMin; x <= xMax + step / 2; x += step) line.push([x, y]);
    hLines.push(line);
  }
  for (let x = xMin; x <= xMax + step / 2; x += step) {
    const line: Vector2D[] = [];
    for (let y = yMin; y <= yMax + step / 2; y += step) line.push([x, y]);
    vLines.push(line);
  }
  return { hLines, vLines };
}
