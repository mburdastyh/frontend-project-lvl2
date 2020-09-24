install:
	npm install

start:
	npm start --  __fixtures__/jsonTest1.json __fixtures__/jsonTest2.json

publish:
	npm publish --dry-run

lint:
	npm run lint

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
