install:
	npm install

start:
	node bin/gendiff.js

publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm test