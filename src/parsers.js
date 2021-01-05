import yaml from 'js-yaml';
import ini from 'ini';

const mapping = {
  json: (content) => JSON.parse(content),
  yaml: (content) => yaml.safeLoad(content),
  yml: (content) => yaml.safeLoad(content),
  ini: (content) => ini.decode(content),
};

export default (content, type) => {
  const parser = mapping[type];

  if (typeof parser !== 'function') {
    throw new Error('!!!!!!Unsupported file extension!!!!!!!!');
  }

  return parser(content);
};
