// @ts-check

import { getFixturePath } from '../src/utils.js';
import { parseFile } from '../src/parsers.js';

describe('Parser test', () => {
  const expectedData = {
    common: {
      setting1: 'Value 1',
      setting2: '200',
      setting3: true,
      setting6: { key: 'value', doge: { wow: 'too much' } },
    },
    group1: {
      baz: 'bas',
      foo: 'bar',
      nest: { key: 'value' },
    },
    group2: {
      abc: '12345',
      deep: { id: '45' },
    },
  };

  test('parse json', async () => {
    const actualData = await parseFile(getFixturePath('forParserJson.json'));
    expect(actualData).toEqual(expectedData);
  });

  test('parse yaml', async () => {
    const actualData = await parseFile(getFixturePath('forParserYaml.yaml'));
    expect(actualData).toEqual(expectedData);
  });

  test('parse ini', async () => {
    const actualData = await parseFile(getFixturePath('forParserIni.ini'));
    expect(actualData).toEqual(expectedData);
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
});
