/*
 *
 * user/repo
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

require('array.prototype.find');

var position,
    orientation,
    grid,
    obstacles;

/*jshint unused: true, node: true */
exports.Rover = function(initialPos, initialOrientation) {
    // TODO: all attributes should be private
    position = {
        x: initialPos.x,
        y: initialPos.y
    };

    orientation = initialOrientation;
    
    this.commands = [];

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

function commandsAreCorrect(commands) {
    for (var command in commands) {
        if (typeof commands[command] !== 'string') {
            return false;
        }
    }
    return true;
}

exp.setCommands = function(commands) {
    if (commands instanceof Array && commandsAreCorrect(commands)) {
        this.commands = commands;
        return 'Roger that!';
    } else {
        return 'No comprende!';
    }
};

exp.inUpperBorder = function() {
    return (position.y === Math.floor(grid.height / 2));
};

exp.inLowerBorder = function() {
    return (position.y === -Math.floor(grid.height / 2));
};

exp.inRightBorder = function() {
    return (position.x === Math.floor(grid.width / 2));
};

exp.inLeftBorder = function() {
    return (position.x === -Math.floor(grid.width / 2));
};

exp.isFreePosition = function(posX, posY) {
    return !obstacles.find(function(element) {
        return (element.x === posX && element.y === posY);
    });
};


// TODO: all this goXXX functions share a common algorithm. Refactor.
exp.goUp = function() {
    if (this.inUpperBorder() && this.isFreePosition(position.x, -position.y)) {
        position.y = -position.y;
    } else if (this.isFreePosition(position.x, position.y + 1)) {
        position.y += 1;
    } else {
        throw new Error('Obstacle found!');
    }
};

exp.goDown = function() {
    if (this.inLowerBorder() && this.isFreePosition(position.x, -position.y)) {
        position.y = -position.y;
    } else if (this.isFreePosition(position.x, position.y - 1)) {
        position.y -= 1;
    } else {
        throw new Error('Obstacle found!');
    }
};

exp.goRight = function() {
    if (this.inRightBorder() && this.isFreePosition(-position.x, position.y)) {
        position.x = -position.x;
    } else if (this.isFreePosition(position.x + 1, position.y)) {
        position.x += 1;
    } else {
        throw new Error('Obstacle found!');
    }
};

exp.goLeft = function() {
    if (this.inLeftBorder() && this.isFreePosition(-position.x, position.y)) {
        position.x = -position.x;
    } else if (this.isFreePosition(position.x - 1, position.y)) {
        position.x -= 1;
    } else {
         throw new Error('Obstacle found!');
    }

};

var ORIENTATIONS = 'NESW';

exp.turnRight = function() {
    if (orientation === 'W') {
        orientation = 'N';
    } else {
        orientation = ORIENTATIONS[ORIENTATIONS.indexOf(orientation) + 1];
    }
};

exp.turnLeft = function() {
    if (orientation === 'N') {
        orientation = 'W';
    } else {
        orientation = ORIENTATIONS[ORIENTATIONS.indexOf(orientation) - 1];
    }
};

exp.commandStrategies = {
    'f': {
        execute: function() {
            switch (orientation) {
                case 'N':
                    this.goUp();
                    break;
                case 'E':
                    this.goRight();
                    break;
                case 'S':
                    this.goDown();
                    break;
                case 'W':
                    this.goLeft();
                    break;
            }
        },
    },
    'b': {
        execute: function() {
            switch (orientation) {
                case 'N':
                    this.goDown();
                    break;
                case 'E':
                    this.goLeft();
                    break;
                case 'S':
                    this.goUp();
                    break;
                case 'W':
                    this.goRight();
                    break;
            }
        },
    },
    'l': {
        execute: function() {
            this.turnLeft();
        },
    },
    'r': {
        execute: function() {
            this.turnRight();
        },
    }
};

exp.executeCommands = function() {
    try {
        for (var com in this.commands) {
            this.commandStrategies[this.commands[com]].execute.call(this);
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