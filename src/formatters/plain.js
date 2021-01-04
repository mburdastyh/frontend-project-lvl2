import states from '../states.js';

const convertObjToString = (obj) => {
  switch (typeof obj) {
    case 'string':
      return `'${obj}'`;
    case 'object':
      return '[complex value]';
    default:
      return `${obj}`;
  }
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
  diffObj.sort((a, b) => a.key.localeCompare(b.key));

  const diffContent = diffObj.map((node) => {
    const {
      key,
      value,
      children,
      state,
    } = node;

    if (diffObj.length === 0) return '';

    const keyFromRoot = path === '' ? key : `${path}.${key}`;

    switch (state) {
      case states.added:
        return `Property '${keyFromRoot}' was added with value: ${convertObjToString(value[0])}`;
      case states.deleted:
        return `Property '${keyFromRoot}' was removed`;
      case states.nested:
        return plain(children, keyFromRoot);
      case states.changed:
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
