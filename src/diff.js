// @ts-check

import { has, readFile, compareTwoObjects } from './utils.js';
import { parseFile } from './parsers.js';

const states = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged',
};

const spaces = (level = 1) => '  '.repeat(level);

const convertObjToString = (obj, level) => {
  if (typeof obj !== 'object') return `${obj}`;

  const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
  const lines = keys.map((key) => `${spaces(level + 2)}${key}: ${convertObjToString(obj[key], level + 2)}`);

  return `{\n${lines.join('\n')}\n${spaces(level)}}`;
};

/**
 * @typedef {{
 *  [key: string]: { state: string, value: object[], children?: DiffObject }
 * }} DiffObject
 */

/**
 *
 * @param {DiffObject} diffObj diff object
 */
export const stylish = (diffObj, level = 0) => {
  if (Object.keys(diffObj).length === 0) return '{}';

  const diffKeys = Object.keys(diffObj).sort((a, b) => a.localeCompare(b));

  const diffContent = diffKeys.map((key) => {
    const { state, value, children } = diffObj[key];

    switch (state) {
      case states.added:
        return `${spaces(level + 1)}+ ${key}: ${convertObjToString(value[0], level + 2)}`;
      case states.deleted:
        return `${spaces(level + 1)}- ${key}: ${convertObjToString(value[0], level + 2)}`;
      case states.changed:
        if (children) {
          return `${spaces(level + 2)}${key}: ${stylish(children, level + 2)}`;
        }
        return [
          `${spaces(level + 1)}- ${key}: ${convertObjToString(value[0], level + 2)}`,
          `${spaces(level + 1)}+ ${key}: ${convertObjToString(value[1], level + 2)}`,
        ];
      case states.unchanged:
        return `${spaces(level + 2)}${key}: ${convertObjToString(value[0], level + 3)}`;
      default:
        throw new Error('Wrong state!');
    }
  })
    .flat()
    .join('\n');

  return `{\n${diffContent}\n${spaces(level)}}`;
};

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

export default async (filePath1, filePath2) => {
  const obj1 = await parseFile(filePath1);
  const obj2 = await parseFile(filePath2);

  return stylish(getDiff(obj1, obj2));
};
