# Web Stuff

## Typescript

```sh
# Installation and initialization
npm install --save-dev typescript
npx tsc --init

# ...
# write stuff
# ...

# Compile
npm tsc
```

Interesting properties that could be modified from `tsconfig.json` are:

* `outDir` to something like `./build/`.
* `noImplicitAny` to `false`.
* `strictNullChecks` to `false`.