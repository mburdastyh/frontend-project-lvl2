/**
 * @typedef {{
  *  [key: string]: { state: string, value: object[], children?: DiffObject }
  * }} DiffObject
  */

/**
  *
  * @param {DiffObject} diffObj diff object
  */
const json = (diffObj) => JSON.stringify(diffObj);

export default json;
