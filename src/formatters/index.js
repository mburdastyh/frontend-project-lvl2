import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

const formatters = {
  stylish,
  plain,
  json,
};

export default (format) => {
  if (formatters[format]) {
    return formatters[format];
  }

  throw new Error(`Unknown Format: ${format}`);
};
