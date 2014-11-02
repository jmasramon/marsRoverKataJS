/*
 *
 * user/repo
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

require('array.prototype.find');

/*jshint unused: true, node: true */

(function() {

    // CONSTANTS //////////////////////////////////////////
    var ORIENTATIONS = 'NESW';

    // PRIVATE ATTRIBUTES /////////////////////////////////
    var position,
        orientation,
        commands,
        grid,
        obstacles,
        commandStrategies;

    // API ///////////////////////////////////////////////
    exports.Rover = function(initialPos, initialOrientation) {
        position = {
            x: initialPos.x,
            y: initialPos.y
        };

        orientation = initialOrientation;

        commands = [];

        // TODO: grid and obstacles seems to belong to an external environtment object
        grid = {
            height: 11,
            width: 11,
        };

        obstacles = [];
    };

    var exp = exports.Rover.prototype;

    exp.getPosition = function() {
        return {
            x: position.x,
            y: position.y
        };
    };

    exp.getOrientation = function() {
        return orientation;
    };

    exp.setCommands = function(newCommands) {
        if (newCommands instanceof Array && commandsAreCorrect(newCommands)) {
            commands = newCommands;
            return 'Roger that!';
        } else {
            return 'No comprende!';
        }
    };

    exp.executeCommands = function() {
        try {
            for (var com in commands) {
                commandStrategies[commands[com]].execute.call(this);
            }
        } catch (err) {
            throw err;
        }
    };

    exp.bewareOfObstacles = function(newObstacles) {
        if (newObstacles || newObstacles instanceof Array) {
            obstacles = newObstacles;
            return 'Roger that!';
        } else {
            return 'Bad obstacle list';
        }
    };

    exp.getObstacles = function() {
        return obstacles;
    };



    /////////////////// PRIVATE FUNCTIONS /////////////////////////////

    function commandsAreCorrect(commandsToCheck) {
        for (var command in commandsToCheck) {
            if (typeof commandsToCheck[command] !== 'string') {
                return false;
            }
        }
        return true;
    }

    function inVerticalBorder () {
        return (Math.abs(position.y) === Math.floor(grid.height / 2));
    }

    function inHorizontalBorder () {
        return (Math.abs(position.x) === Math.floor(grid.width / 2));
    }

    function isFreePosition(posX, posY) {
        return !obstacles.find(function(element) {
            return (element.x === posX && element.y === posY);
        });
    }

    // TODO: all this goXXX functions share a common algorithm. Refactor.
    function goUp() {
        if (inVerticalBorder() && isFreePosition(position.x, -position.y)) {
            position.y = -position.y;
        } else if (isFreePosition(position.x, position.y + 1)) {
            position.y += 1;
        } else {
            throw new Error('Obstacle found!');
        }
    }

    function goDown() {
        if (inVerticalBorder() && isFreePosition(position.x, -position.y)) {
            position.y = -position.y;
        } else if (isFreePosition(position.x, position.y - 1)) {
            position.y -= 1;
        } else {
            throw new Error('Obstacle found!');
        }
    }

    function goRight() {
        if (inHorizontalBorder() && isFreePosition(-position.x, position.y)) {
            position.x = -position.x;
        } else if (isFreePosition(position.x + 1, position.y)) {
            position.x += 1;
        } else {
            throw new Error('Obstacle found!');
        }
    }

    function goLeft() {
        if (inHorizontalBorder() && isFreePosition(-position.x, position.y)) {
            position.x = -position.x;
        } else if (isFreePosition(position.x - 1, position.y)) {
            position.x -= 1;
        } else {
            throw new Error('Obstacle found!');
        }

    }

    function turnRight() {
        if (orientation === 'W') {
            orientation = 'N';
        } else {
            orientation = ORIENTATIONS[ORIENTATIONS.indexOf(orientation) + 1];
        }
    }

    function turnLeft() {
        if (orientation === 'N') {
            orientation = 'W';
        } else {
            orientation = ORIENTATIONS[ORIENTATIONS.indexOf(orientation) - 1];
        }
    }

    // TODO the switch can be substituted by a map same like commandStrategies itself
    commandStrategies = {
        'f': {
            execute: function() {
                switch (orientation) {
                    case 'N':
                        goUp();
                        break;
                    case 'E':
                        goRight();
                        break;
                    case 'S':
                        goDown();
                        break;
                    case 'W':
                        goLeft();
                        break;
                }
            },
        },
        'b': {
            execute: function() {
                switch (orientation) {
                    case 'N':
                        goDown();
                        break;
                    case 'E':
                        goLeft();
                        break;
                    case 'S':
                        goUp();
                        break;
                    case 'W':
                        goRight();
                        break;
                }
            },
        },
        'l': {
            execute: function() {
                turnLeft();
            },
        },
        'r': {
            execute: function() {
                turnRight();
            },
        }
    };

})();