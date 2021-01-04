// @ts-check

import path from 'path';
import { promises as fs } from 'fs';
import parseFile from './parsers.js';
import getFormatter from './formatters/index.js';
import states from './states.js';

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const readFile = (absfilePath) => fs.readFile(absfilePath, 'utf-8');

const getDiff = (data1, data2) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const uniqKeys = keys1
    .concat(keys2)
    .filter((key, index, arr) => arr.indexOf(key) === index);

  const diff = uniqKeys.map((key) => {
    if (!has(data1, key)) {
      return { key, value: [data2[key]], state: states.added };
    }

    if (!has(data2, key)) {
      return { key, value: [data1[key]], state: states.deleted };
    }

    if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
      return { key, children: getDiff(data1[key], data2[key]), state: states.nested };
    }

    if (data1[key] === data2[key]) {
      return { key, value: data1[key], state: states.unchanged };
    }

    return { key, value: [data1[key], data2[key]], state: states.changed };
  }, []);

  return diff;
};

export default async (filePath1, filePath2, format) => {
  const content1 = await readFile(path.resolve(process.cwd(), filePath1));
  const type1 = path.extname(filePath1).slice(1);
  const obj1 = await parseFile(content1, type1);

  const content2 = await readFile(path.resolve(process.cwd(), filePath2));
  const type2 = path.extname(filePath2).slice(1);
  const obj2 = await parseFile(content2, type2);

  const formatter = getFormatter(format);

  return formatter(getDiff(obj1, obj2));
};
