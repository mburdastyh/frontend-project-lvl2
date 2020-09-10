// @ts-check

import { promises as fs } from 'fs';

export const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

export const readFile = (absfilePath) => fs.readFile(absfilePath, 'utf-8');
