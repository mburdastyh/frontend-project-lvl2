// @ts-check

import { has, compareTwoObjects } from './utils.js';
import { parseFile } from './parsers.js';
import getFormatter from './formatters/index.js';
import { states } from './states.js';

export const getDiff = (data1, data2) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const uniqKeys = keys1
    .concat(keys2)
    .filter((key, index, arr) => arr.indexOf(key) === index);

  const diff = uniqKeys.reduce((acc, key) => {
    if (!has(data1, key)) {
      acc[key] = { state: states.added, value: [data2[key]] };
      return acc;
    }

    if (!has(data2, key)) {
      acc[key] = { state: states.deleted, value: [data1[key]] };
      return acc;
    }

    if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
      const isEqual = compareTwoObjects(data1[key], data2[key]);
      if (isEqual) {
        acc[key] = { state: states.unchanged, value: [data1[key]] };
        return acc;
      }

      const inner = getDiff(data1[key], data2[key]);
      acc[key] = { state: states.changed, children: inner };

      return acc;
    }

    if (typeof data1[key] !== 'object' && typeof data2[key] !== 'object') {
      if (data1[key] !== data2[key]) {
        acc[key] = { state: states.changed, value: [data1[key], data2[key]] };
      } else {
        acc[key] = { state: states.unchanged, value: [data1[key]] };
      }

      return acc;
    }

    acc[key] = { state: states.changed, value: [data1[key], data2[key]] };

    return acc;
  }, {});

  return diff;
};

export default async (filePath1, filePath2, format) => {
  const obj1 = await parseFile(filePath1);
  const obj2 = await parseFile(filePath2);
  const formatter = getFormatter(format);

  return formatter(getDiff(obj1, obj2));
};
