// @ts-check
import path from 'path';
import diff, { readJsonFile, getDiff } from '../src/diff.js';
import { readFile } from '../src/utils.js';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('read files', async () => {
  const actualData = await readJsonFile(getFixturePath('jsonTest1.json'));
  const expectedData = {
    host: 'hexlet.io',
    timeout: 500,
    proxy: '123.234.53.22',
    follow: false,
  };

  expect(actualData).toEqual(expectedData);
});

describe('getDiff', () => {
  test('emptyObjects', () => {
    expect(getDiff({}, {})).toEqual('{\n\n}');
  });

  test('differentObjects', async () => {
    const data1 = { key1: 'unchange', key2: 'change', key3: 'delete' };
    const data2 = { key1: 'unchange', key2: 'Change!', key4: 'add' };
    const expected = await readFile(getFixturePath('resultForObject.txt'));

    expect(getDiff(data1, data2)).toEqual(expected);
  });

  test('equalObjects', async () => {
    const data1 = { key1: 'unchange' };
    const data2 = { key1: 'unchange' };

    expect(getDiff(data1, data2)).toEqual('{\n    key1: unchange\n}');
  });
});

test('diff', async () => {
  const actualData = await diff(getFixturePath('jsonTest1.json'), getFixturePath('jsonTest2.json'));
  const expectedData = await readFile(getFixturePath('resultForJson.txt'));

  expect(actualData).toEqual(expectedData);
});
