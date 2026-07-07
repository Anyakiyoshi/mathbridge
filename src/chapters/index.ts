import type { Chapter } from '../store/useStore';

// Lazy-load all chapters
import { chapter01 } from './chapter01_Limits';
import { chapter02 } from './chapter02_Derivatives';
import { chapter03 } from './chapter03_MeanValue';
import { chapter04 } from './chapter04_IndefIntegral';
import { chapter05 } from './chapter05_DefIntegral';
import { chapter06 } from './chapter06_Applications';
import { chapter07 } from './chapter07_DiffEq';
import { chapter08 } from './chapter08_Multivariable';
import { chapter09 } from './chapter09_MultipleIntegrals';
import { chapter10 } from './chapter10_Series';

export const CHAPTERS: Chapter[] = [
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  chapter05,
  chapter06,
  chapter07,
  chapter08,
  chapter09,
  chapter10,
];
