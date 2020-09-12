// @ts-check

import { has, readFile } from './utils.js';
import { parseFile } from './parsers.js';

const states = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged',
};

export const getDiff = (data1, data2) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const uniqKeys = keys1
    .concat(keys2)
    .filter((key, index, arr) => arr.indexOf(key) === index);

  const diff = uniqKeys.reduce((acc, key) => {
    if (!has(data1, key)) {
      acc[key] = states.added;
    } else if (!has(data2, key)) {
      acc[key] = states.deleted;
    } else if (data1[key] !== data2[key]) {
      acc[key] = states.changed;
    } else {
      acc[key] = states.unchanged;
    }

    return acc;
  }, {});

  const diffKeys = Object.keys(diff).sort((a, b) => a.localeCompare(b));

  const diffContent = diffKeys.map((key) => {
    switch (diff[key]) {
      case states.added:
        return `+ ${key}: ${data2[key]}`;
      case states.deleted:
        return `- ${key}: ${data1[key]}`;
      case states.changed:
        return [`- ${key}: ${data1[key]}`, `+ ${key}: ${data2[key]}`];
      case states.unchanged:
        return `  ${key}: ${data1[key]}`;
      default:
        throw new Error('Wrong state!');
    }
  })
    .flat()
    .map((line) => `  ${line}`)
    .join('\n');

  return `{\n${diffContent}\n}`;
};

export default async (filePath1, filePath2) => {
  const obj1 = await parseFile(filePath1);
  const obj2 = await parseFile(filePath2);

  return getDiff(obj1, obj2);
};
