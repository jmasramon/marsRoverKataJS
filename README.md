#  [![Build Status](https://secure.travis-ci.org//marsrover.png?branch=master)](http://travis-ci.org//marsrover)

> The best module ever.


## Getting Started

Install the module with: `npm install marsrover`

```js
var marsrover = require('marsrover');
marsrover.awesome(); // "awesome"
```

Install with cli command

```sh
$ npm install -g marsrover
$ marsrover --help
$ marsrover --version
```


```sh
# creates a browser.js
$ grunt browserify
```



## Documentation Jordi's version

I have done this kata in javascript to play a little with the different types of 
inheritance you can use in javascript and the implications of each one.

I have created a map object with a classical inheritance pattern: a constructor function and new

I have created a standardStrategy as the parent object of all movingStrategies using the modern 
pattern of prototypical inheritance (kind of). standarStrategy is a singleton defined with and object
Literal. It has no constructor function -> no access to prototype -> cannot use Object.create to 
create child objects -> monkey patch instead.

standardStrategy could be better with a constructor function and using Object.create(constructor.prototype)?
It would need implementing the Singleton pattern so it seems overkill.