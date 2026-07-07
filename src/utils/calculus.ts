// Calculus utilities: Taylor series, derivatives, etc.

// Evaluate a Taylor polynomial at x given coefficients c[0..n] where
// P_n(x) = c[0] + c[1]*(x-a) + c[2]*(x-a)^2 + ... + c[n]*(x-a)^n
export function evalTaylor(
  x: number,
  a: number,
  coeffs: number[]
): number {
  let result = 0;
  let power = 1;
  for (let i = 0; i < coeffs.length; i++) {
    result += coeffs[i] * power;
    power *= (x - a);
  }
  return result;
}

// Pre-computed Taylor coefficients at a=0 (Maclaurin) for common functions
// Each returns coefficients up to a max degree
export function taylorCoeffsSin(n: number): number[] {
  const c: number[] = [];
  for (let k = 0; k <= n; k++) {
    if (k % 2 === 0) {
      c.push(0);
    } else {
      c.push((k % 4 === 1 ? 1 : -1) / factorial(k));
    }
  }
  return c;
}

export function taylorCoeffsCos(n: number): number[] {
  const c: number[] = [];
  for (let k = 0; k <= n; k++) {
    if (k % 2 === 0) {
      c.push((k % 4 === 0 ? 1 : -1) / factorial(k));
    } else {
      c.push(0);
    }
  }
  return c;
}

export function taylorCoeffsExp(n: number): number[] {
  const c: number[] = [];
  for (let k = 0; k <= n; k++) {
    c.push(1 / factorial(k));
  }
  return c;
}

export function taylorCoeffsLn1px(n: number): number[] {
  const c: number[] = [0]; // ln(1+0) = 0
  for (let k = 1; k <= n; k++) {
    c.push((k % 2 === 1 ? 1 : -1) / k);
  }
  return c;
}

export function taylorCoeffsArctan(n: number): number[] {
  const c: number[] = [0];
  for (let k = 1; k <= n; k++) {
    if (k % 2 === 0) {
      c.push(0);
    } else {
      c.push((k % 4 === 1 ? 1 : -1) / k);
    }
  }
  return c;
}

export function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export type FuncName = 'sin' | 'cos' | 'exp' | 'ln1px' | 'arctan';

export function getTaylorCoeffs(name: FuncName, n: number): number[] {
  switch (name) {
    case 'sin': return taylorCoeffsSin(n);
    case 'cos': return taylorCoeffsCos(n);
    case 'exp': return taylorCoeffsExp(n);
    case 'ln1px': return taylorCoeffsLn1px(n);
    case 'arctan': return taylorCoeffsArctan(n);
  }
}

export function evalOriginal(name: FuncName, x: number): number {
  switch (name) {
    case 'sin': return Math.sin(x);
    case 'cos': return Math.cos(x);
    case 'exp': return Math.exp(x);
    case 'ln1px': return Math.log(1 + x);
    case 'arctan': return Math.atan(x);
  }
}

export function originalDomain(name: FuncName): [number, number] {
  switch (name) {
    case 'sin': return [-2 * Math.PI, 2 * Math.PI];
    case 'cos': return [-2 * Math.PI, 2 * Math.PI];
    case 'exp': return [-2, 2];
    case 'ln1px': return [-0.95, 2];
    case 'arctan': return [-3, 3];
  }
}

export function getDerivativeCoeffs(coeffs: number[]): number[] {
  // d/dx of P_n(x) = c[1] + 2*c[2]*(x-a) + 3*c[3]*(x-a)^2 + ...
  const dc: number[] = [];
  for (let i = 1; i < coeffs.length; i++) {
    dc.push(i * coeffs[i]);
  }
  return dc;
}

// Numerical derivative using central difference
export function numericalDerivative(
  f: (x: number) => number,
  x: number,
  h = 1e-6
): number {
  return (f(x + h) - f(x - h)) / (2 * h);
}

// Numerical gradient for R^2 -> R
export function numericalGradient(
  f: (x: number, y: number) => number,
  x: number,
  y: number,
  h = 1e-6
): [number, number] {
  const dfx = (f(x + h, y) - f(x - h, y)) / (2 * h);
  const dfy = (f(x, y + h) - f(x, y - h)) / (2 * h);
  return [dfx, dfy];
}
