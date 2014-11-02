/*
 *
 * user/repo
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

require('array.prototype.find');

/* jshint unused: true, node: true */

(function() {

    // CONSTANTS //////////////////////////////////////////
    var ORIENTATIONS = 'NESW';

    // PRIVATE ATTRIBUTES /////////////////////////////////
    var position,
        orientation,
        commands,
        environmentMap,
        commandStrategies,
        forwardTactics,
        backwardTactics;

    // API ///////////////////////////////////////////////
    exports.Rover = function(initialPos, initialOrientation, _environmentMap_) {
        position = initialPos;

        orientation = initialOrientation;

        commands = [];

        if (_environmentMap_) {
            environmentMap = _environmentMap_;
        }
    };

    var exp = exports.Rover.prototype;

    exp.setMap = function(_environmentMap_){
        environmentMap = _environmentMap_;
    };

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
            environmentMap.obstacles = newObstacles;
            return 'Roger that!';
        } else {
            return 'Bad obstacle list';
        }
    };

    exp.getObstacles = function() {
        return environmentMap.obstacles;
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

    function inVerticalBorder() {
        return (Math.abs(position.y) === Math.floor(environmentMap.grid.height / 2));
    }

    function inHorizontalBorder() {
        return (Math.abs(position.x) === Math.floor(environmentMap.grid.width / 2));
    }

    function isFreePosition(posX, posY) {
        return !environmentMap.obstacles.find(function(element) {
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

    environmentMap = {
        grid: {
            height: 11,
            width: 11
        },
        obstacles: []
    };

    commandStrategies = {
        'f': {
            execute: function() {
                forwardTactics[orientation]();
            }
        },
        'b': {
            execute: function() {
                backwardTactics[orientation]();
            }
        },
        'l': {
            execute: function() {
                turnLeft();
            }
        },
        'r': {
            execute: function() {
                turnRight();
            }
        }
    };

    forwardTactics = {
        'N': goUp,
        'E': goRight,
        'S': goDown,
        'W': goLeft
    };

    backwardTactics = {
        'N': goDown,
        'E': goLeft,
        'S': goUp,
        'W': goRight
    };

})();