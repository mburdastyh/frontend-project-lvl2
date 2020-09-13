// @ts-check

import { getFixturePath } from '../src/utils.js';
import { parseFile } from '../src/parsers.js';

describe('Parser test', () => {
  const expectedData = {
    host: 'hexlet.io',
    timeout: 500,
    proxy: '123.234.53.22',
    follow: false,
  };

  test('parse json', async () => {
    const actualData = await parseFile(getFixturePath('jsonTest1.json'));

    expect(actualData).toEqual(expectedData);
  });

  test('parse yaml', async () => {
    const actualData = await parseFile(getFixturePath('yamlTest1.yaml'));

    expect(actualData).toEqual(expectedData);
  });

  test('parse ini', async () => {
    const actualData = await parseFile(getFixturePath('iniTest1.ini'));
    actualData.timeout = +actualData.timeout; // ini parser can't read number from string

    expect(actualData).toEqual(expectedData);
  });
});

test('wrong extension', async () => {
  let error = null;

  try {
    await parseFile(getFixturePath('yamlTest1.no'));
  } catch (e) {
    error = e;
  }

  expect(error).not.toBeNull();
});
