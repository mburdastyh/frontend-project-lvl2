// @ts-check

import { promises as fs } from 'fs';
import path from 'path';

export const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

export const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

export const readFile = (absfilePath) => fs.readFile(absfilePath, 'utf-8');
