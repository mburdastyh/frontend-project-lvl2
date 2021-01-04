// @ts-check
import path from 'path';
import fs from 'fs';
import diff from '../src/diff.js';

const readFile = (absfilePath) => fs.readFileSync(absfilePath, 'utf-8');
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('diff', () => {
  test('Stylish formatter for different json files', () => {
    const actualData = diff(getFixturePath('jsonTest1.json'), getFixturePath('jsonTest2.json'), 'stylish');
    const expectedData = readFile(getFixturePath('resultStylishForJson.txt'));

    expect(actualData).toEqual(expectedData);
  });

  test('Plain formatter for different json files', () => {
    const actualData = diff(getFixturePath('jsonTest1.json'), getFixturePath('jsonTest2.json'), 'plain');
    const expectedData = readFile(getFixturePath('resultPlainForJson.txt'));

    expect(actualData).toEqual(expectedData);
  });

  test('Json formatter for different json files', () => {
    const actualData = diff(getFixturePath('jsonTest1.json'), getFixturePath('jsonTest2.json'), 'json');
    const expectedData = readFile(getFixturePath('resultJsonForJson.txt'));

    expect(expectedData).toEqual(actualData);
  });
});
