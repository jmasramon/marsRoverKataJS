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

    exp.setMap = function(_environmentMap_) {
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
        if (commandsAreCorrect(newCommands)) {
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
        if (obstaclesAreCorrect(newObstacles)) {
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
        if (!(commandsToCheck && commandsToCheck instanceof Array)) {
            return false;
        }
        for (var command in commandsToCheck) {
            if (typeof commandsToCheck[command] !== 'string') {
                return false;
            }
        }
        return true;
    }

    function obstaclesAreCorrect(obstaclesToCheck) {
        if (!(obstaclesToCheck && obstaclesToCheck instanceof Array)) {
            return false;
        }
        for (var obstacle in obstaclesToCheck) {
            if (typeof obstaclesToCheck[obstacle] !== 'object') {
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
    function moveVertically(direction) {
        if (inVerticalBorder() && isFreePosition(position.x, -position.y)) {
            position.y = -position.y;
        } else if (direction === 'up' && isFreePosition(position.x, position.y + 1)) {
            position.y += 1;
        } else if (direction === 'down' && isFreePosition(position.x, position.y - 1)) {
            position.y -= 1;
        } else {
            throw new Error('Obstacle found!');
        }
    }

    function moveHorizontally(direction) {
        if (inHorizontalBorder() && isFreePosition(-position.x, position.y)) {
            position.x = -position.x;
        } else if (direction === 'right' && isFreePosition(position.x + 1, position.y)) {
            position.x += 1;
        } else if (direction === 'left' && isFreePosition(position.x - 1, position.y)) {
            position.x -= 1;
        } else {
            throw new Error('Obstacle found!');
        }
    }

    function turnRight() {
        if (atOrientationsRightLimit()) {
            orientation = ORIENTATIONS[0];
        } else {
            orientation = ORIENTATIONS[ORIENTATIONS.indexOf(orientation) + 1];
        }
    }

    function turnLeft() {
        if (atOrientationsLeftLimit()) {
            orientation = ORIENTATIONS[ORIENTATIONS.length - 1];
        } else {
            orientation = ORIENTATIONS[ORIENTATIONS.indexOf(orientation) - 1];
        }
    }

    function atOrientationsRightLimit() {
        return (ORIENTATIONS.indexOf(orientation) + 1 === ORIENTATIONS.length);
    }

    function atOrientationsLeftLimit() {
        return (ORIENTATIONS.indexOf(orientation) - 1 < 0);
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
        'N': function() {
            moveVertically('up');
        },
        'E': function() {
            moveHorizontally('right');
        },
        'S': function() {
            moveVertically('down');
        },
        'W': function() {
            moveHorizontally('left');
        }
    };

    backwardTactics = {
        'N': function() {
            moveVertically('down');
        },
        'E': function() {
            moveHorizontally('left');
        },
        'S': function() {
            moveVertically('up');
        },
        'W': function() {
            moveHorizontally('right');
        }
    };

})();