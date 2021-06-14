# @reactiff/midi

React library for interfacing with MIDI controllers

[![NPM](https://img.shields.io/npm/v/@reactiff/midi.svg)](https://www.npmjs.com/package/@reactiff/midi) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# 2. Git init

Did you create the repo on github? https://github.com/reactiff?tab=repositories

```bash
# in root 

git init
git add .
git commit -m "Initial commit"
git branch -M master
git remote add origin https://github.com/reactiff/midi.git
git push -u origin master
echo 'DONE'
```

<br>

# 3. Install, link and start
```bash
# in root
yarn link
yarn install
cd example
yarn link "@reactiff/midi"
yarn install
echo 'DONE'


```
then to start
```bash
# in one tab
yarn start

# in another tab
cd example
yarn start
```

# 4. Publish package first time
```bash
npm publish --access public
```

> DELETE THE ABOVE INSTRUCTIONS AFTER YOU'RE DONE

## Install

```bash
yarn add @reactiff/midi
```

## Usage

```tsx
import Component from '@reactiff/midi'

const instance = new Component();

// do stuff with it
```

## Publishing the package to npm

First time (with free account) if scoped, must set access to public
```bash
npm publish --access public
```

To update
```bash
npm version major|minor|patch
```

and then simply
```bash
npm publish
```

---

## License

MIT © [Rick Ellis](https://github.com/reactiff)
