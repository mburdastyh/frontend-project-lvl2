install:
	npm install

start:
	npm start --  __fixtures__/jsonTest1.json __fixtures__/jsonTest2.json

publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	npx jest

test-coverage:
	npx jest --coverage --coverageProvider=v8
