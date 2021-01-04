// @ts-check
import path from 'path';
import { promises as fs } from 'fs';
import diff from '../src/diff.js';

const readFile = (absfilePath) => fs.readFile(absfilePath, 'utf-8');
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('diff', () => {
  test('Stylish formatter for different json files', async () => {
    const actualData = await diff(getFixturePath('jsonTest1.json'), getFixturePath('jsonTest2.json'), 'stylish');
    const expectedData = await readFile(getFixturePath('resultStylishForJson.txt'));

    expect(actualData).toEqual(expectedData);
  });

  test('Plain formatter for different json files', async () => {
    const actualData = await diff(getFixturePath('jsonTest1.json'), getFixturePath('jsonTest2.json'), 'plain');
    const expectedData = await readFile(getFixturePath('resultPlainForJson.txt'));

    expect(actualData).toEqual(expectedData);
  });

  test('Json formatter for different json files', async () => {
    const actualData = await diff(getFixturePath('jsonTest1.json'), getFixturePath('jsonTest2.json'), 'json');
    const expectedData = await readFile(getFixturePath('resultJsonForJson.txt'));

    expect(expectedData).toEqual(actualData);
  });
});
