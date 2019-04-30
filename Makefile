start:
	npx babel-node -- src/bin/gendiff.js -h

install:
	npm install

publish:
	npm publish

lint:
	npx eslint .

test:
	npm run test

testwatch:
	npm run test:watch

testone:
	npm run test:one

testcoverage:
	npm run test:coverage





