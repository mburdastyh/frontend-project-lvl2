import { states } from '../states.js';

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
const stylish = (diffObj, level = 0) => {
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

export default stylish;
