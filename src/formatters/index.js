import plain from './plain.js';
import stylish from './stylish.js';

const formatters = {
  stylish: () => stylish,
  plain: () => plain,
};

export default (format) => formatters[format]();
