// @ts-check

import diff, { getDiff } from '../src/diff.js';
import { readFile, getFixturePath } from '../src/utils.js';

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
