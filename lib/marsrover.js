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
        marsMap,
        commandStrategies,
        forwardTactics,
        backwardTactics;

    // API ////////////////////////////////////////////////
    exports.Rover = function(initialPos, initialOrientation, _marsMap_) {
        position = initialPos;

        orientation = initialOrientation;

        commands = [];

        if (_marsMap_) {
            marsMap.grid = _marsMap_.grid;
            marsMap.obstacles = _marsMap_.obstacles;
        }
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
        if (commandsAreCorrect(newCommands)) {
            commands = newCommands;
            return 'Roger that!';
        } else {
            return 'No comprende!';
        }
    };

    exp.setMap = function(_marsMap_) {
        marsMap = _marsMap_;
    };

    exp.executeCommands = function() {
        try {
            for (var com in commands) {
                commandStrategies[commands[com]].call(this);
            }
        } catch (err) {
            throw err;
        }
    };

    exp.bewareOfObstacles = function(newObstacles) {
        if (marsMap.obstaclesAreCorrect(newObstacles)) {
            marsMap.obstacles = newObstacles;
            return 'Roger that!';
        } else {
            return 'Bad obstacle list';
        }
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

    function moveVertically(direction) {
        if (needToWrap(direction) && marsMap.noObstacleAhead(position.x, -position.y)) {
            position.y = -position.y;
        } else if (direction === 'up' && marsMap.noObstacleAhead(position.x, position.y + 1)) {
            position.y += 1;
        } else if (direction === 'down' && marsMap.noObstacleAhead(position.x, position.y - 1)) {
            position.y -= 1;
        } else {
            throw new Error('Obstacle found!');
        }
    }

    function moveHorizontally(direction) {
        if (needToWrap(direction) && marsMap.noObstacleAhead(-position.x, position.y)) {
            position.x = -position.x;
        } else if (direction === 'right' && marsMap.noObstacleAhead(position.x + 1, position.y)) {
            position.x += 1;
        } else if (direction === 'left' && marsMap.noObstacleAhead(position.x - 1, position.y)) {
            position.x -= 1;
        } else {
            throw new Error('Obstacle found!');
        }
    }

    function needToWrap(direction) {
        return (direction === 'up' && inTopBorder()) ||
            (direction === 'down' && inBottomBorder()) ||
            (direction === 'right' && inRightBorder()) ||
            (direction === 'left' && inLeftBorder());
    }

    function inTopBorder() {
        return (inVerticalBorder() && position.y > 0);
    }

    function inBottomBorder() {
        return (inVerticalBorder() && position.y < 0);
    }

    function inRightBorder() {
        return (inHorizontalBorder() && position.x > 0);
    }

    function inLeftBorder() {
        return (inHorizontalBorder() && position.x < 0);
    }

    function inVerticalBorder() {
        return (Math.abs(position.y) === marsMap.getVerticalBorder());
    }

    function inHorizontalBorder() {
        return (Math.abs(position.x) === marsMap.getHorizontalBorder());
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

    //////// PRIVATE OBJECTS /////////////////////////////////

    marsMap = {
        grid: {
            height: 11,
            width: 11
        },
        obstacles: [],
        getVerticalBorder: function() {
            return Math.floor(this.grid.height / 2);
        },
        getHorizontalBorder: function() {
            return Math.floor(this.grid.width / 2);
        },
        noObstacleAhead: function(posX, posY) {
            return !this.obstacles.find(function(element) {
                return (element.x === posX && element.y === posY);
            });
        },
        obstaclesAreCorrect: function(obstaclesToCheck) {
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
    };

    commandStrategies = {
        'f': function() {
            forwardTactics[orientation]();
        },
        'b': function() {
            backwardTactics[orientation]();
        },
        'l': function() {
            turnLeft();
        },
        'r': function() {
            turnRight();
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