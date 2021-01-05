import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

const formatters = {
  stylish,
  plain,
  json,
};

export default (format) => formatters[format];
