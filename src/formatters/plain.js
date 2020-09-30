import { states } from '../states.js';

const convertObjToString = (obj) => {
  if (typeof obj === 'string') return `'${obj}'`;

  if (typeof obj === 'object') return '[complex value]';

  return `${obj}`;
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
const plain = (diffObj, path = '') => {
  if (Object.keys(diffObj).length === 0) return '{}';

  const diffKeys = Object.keys(diffObj).sort((a, b) => a.localeCompare(b));

  const diffContent = diffKeys.map((key) => {
    const { state, value, children } = diffObj[key];
    const keyFromRoot = path === '' ? key : `${path}.${key}`;

    switch (state) {
      case states.added:
        return `Property '${keyFromRoot}' was added with value: ${convertObjToString(value[0])}`;
      case states.deleted:
        return `Property '${keyFromRoot}' was removed`;
      case states.changed:
        if (children) {
          return plain(children, keyFromRoot);
        }
        return `Property '${keyFromRoot}' was updated. From ${convertObjToString(value[0])} to ${convertObjToString(value[1])}`;
      case states.unchanged:
        return null;
      default:
        throw new Error('Wrong state!');
    }
  })
    .filter((e) => e !== null)
    .flat()
    .join('\n');

  return `${diffContent}`;
};

export default plain;
