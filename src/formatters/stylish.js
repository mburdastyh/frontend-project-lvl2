import states from '../states.js';

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
  diffObj.sort((a, b) => a.key.localeCompare(b.key));

  const diffContent = diffObj.map((node) => {
    const {
      key,
      value,
      children,
      state,
    } = node;

    switch (state) {
      case states.added:
        return `${spaces(level + 1)}+ ${key}: ${convertObjToString(value[0], level + 2)}`;
      case states.deleted:
        return `${spaces(level + 1)}- ${key}: ${convertObjToString(value[0], level + 2)}`;
      case states.nested:
        return `${spaces(level + 2)}${key}: ${stylish(children, level + 2)}`;
      case states.changed:
        return [
          `${spaces(level + 1)}- ${key}: ${convertObjToString(value[0], level + 2)}`,
          `${spaces(level + 1)}+ ${key}: ${convertObjToString(value[1], level + 2)}`,
        ];
      case states.unchanged:
        return `${spaces(level + 2)}${key}: ${convertObjToString(value, level + 3)}`;
      default:
        throw new Error('Wrong state!');
    }
  })
    .flat()
    .join('\n');

  return `{\n${diffContent}\n${spaces(level)}}`;
};

export default stylish;
