// @ts-check
import _ from 'lodash';
import diff, { getDiff } from '../src/diff.js';
import { readFile, getFixturePath } from '../src/utils.js';

describe('getDiff', () => {
  let initData;
  let changedData;

  beforeEach(() => {
    initData = {
      key: {
        innerKey: 'innerValue',
      },
    };

    changedData = _.cloneDeep(initData);
  });

  test('equal objects', () => {
    const res = {
      key: { state: 'unchanged', value: [{ innerKey: 'innerValue' }] },
    };

    expect(getDiff(initData, initData)).toEqual(res);
  });

  test('key is added', () => {
    changedData.newKey = 'newValue';

    const res = {
      key: { state: 'unchanged', value: [{ innerKey: 'innerValue' }] },
      newKey: { state: 'added', value: ['newValue'] },
    };

    expect(getDiff(initData, changedData)).toEqual(res);
  });

  test('key is deleted', () => {
    changedData.newKey = 'newValue';

    const res = {
      key: { state: 'unchanged', value: [{ innerKey: 'innerValue' }] },
      newKey: { state: 'added', value: ['newValue'] },
    };

    expect(getDiff(initData, changedData)).toEqual(res);
  });

  test('key is changed', () => {
    changedData.key = 'newValue';

    const res = {
      key: { state: 'changed', value: [{ innerKey: 'innerValue' }, 'newValue'] },
    };

    expect(getDiff(initData, changedData)).toEqual(res);
  });

  test('inner key is added', () => {
    changedData.key.newInnerKey = 'newInnerValue';

    const res = {
      key: {
        state: 'changed',
        children: {
          innerKey: { state: 'unchanged', value: ['innerValue'] },
          newInnerKey: { state: 'added', value: ['newInnerValue'] },
        },
      },
    };

    expect(getDiff(initData, changedData)).toEqual(res);
  });

  test('inner key is deleted', () => {
    delete changedData.key.innerKey;

    const res = {
      key: {
        state: 'changed',
        children: {
          innerKey: { state: 'deleted', value: ['innerValue'] },
        },
      },
    };

    expect(getDiff(initData, changedData)).toEqual(res);
  });

  test('inner key is changed', () => {
    changedData.key.innerKey = 'newInnerValue';

    const res = {
      key: {
        state: 'changed',
        children: {
          innerKey: { state: 'changed', value: ['innerValue', 'newInnerValue'] },
        },
      },
    };

    expect(getDiff(initData, changedData)).toEqual(res);
  });
});

describe('diff', () => {
  test('Stylish for different json files', async () => {
    const actualData = await diff(getFixturePath('jsonTest1.json'), getFixturePath('jsonTest2.json'), 'stylish');
    const expectedData = await readFile(getFixturePath('resultStylishForJson.txt'));

    expect(actualData).toEqual(expectedData);
  });

  test('Plain for different json files', async () => {
    const actualData = await diff(getFixturePath('jsonTest1.json'), getFixturePath('jsonTest2.json'), 'plain');
    const expectedData = await readFile(getFixturePath('resultPlainForJson.txt'));

    expect(actualData).toEqual(expectedData);
  });
});
