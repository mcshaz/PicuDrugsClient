# paediatric_drugs

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit --inspect-brk
```
https://github.com/vuejs/vue-cli/issues/2590
https://github.com/Microsoft/vscode/issues/65087
But also you have to set a debugger statement somewhere in the file.
Since this is compiled on the fly, the debugger can't preload the sourcemaps ahead of time. So the debugger statement will give it a brief moment to pause and load sourcemaps.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
