install:
	npm install

start:
	node bin/gendiff.js

publish:
	npm publish --dry-run

lint:
	npm run lint

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
