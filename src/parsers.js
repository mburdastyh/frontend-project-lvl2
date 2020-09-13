import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import { readFile } from './utils.js';

const mapping = {
  json: (content) => JSON.parse(content),
  yaml: (content) => yaml.safeLoad(content),
  ini: (content) => ini.decode(content),
};

export const parseFile = async (filePath) => {
  const type = path.extname(filePath).slice(1);
  const parser = mapping[type];

  if (typeof parser !== 'function') {
    throw new Error('!!!!!!Unsupported file extension!!!!!!!!');
  }

  const absPath = path.resolve(process.cwd(), filePath);
  const content = await readFile(absPath);

  return parser(content);
};
