/*
 *
 * user/repo
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

/*jshint unused: true, node: true */
exports.Rover = function(x, y, orientation) {
    this.x = x;
    this.y = y;
    this.orientation = orientation;
    this.commands = [];
};

exports.Rover.prototype.getPosition = function() {
    return {
        x: this.x,
        y: this.y
    };
};

exports.Rover.prototype.getOrientation = function() {
    return this.orientation;
};

function elementsAreChars(commands) {
    for (var command in commands) {
        if (typeof commands[command] !== 'string') {
            return false;
        }
    }
    return true;
}

exports.Rover.prototype.setCommands = function(commands) {
    if (commands instanceof Array && elementsAreChars(commands)) {
        this.commands = commands;
        return 'Roger that!';
    } else {
        return 'No comprende!';
    }
};

exports.Rover.prototype.commandStrategies = {
    'f': {
        execute: function() {
            switch (this.orientation) {
                case 'N':
                    this.y += 1;
                    break;
                case 'E':
                    this.x += 1;
                    break;
                case 'S':
                    this.y -= 1;
                    break;
                case 'W':
                    this.x -= 1;
                    break;
            }
        },
    },
    'b': {
        execute: function() {
            switch (this.orientation) {
                case 'N':
                    this.y -= 1;
                    break;
                case 'E':
                    this.x -= 1;
                    break;
                case 'S':
                    this.y += 1;
                    break;
                case 'W':
                    this.x += 1;
                    break;
            }
        },
    }
};

exports.Rover.prototype.executeCommands = function() {
    // switch (this.commands[0]) {
    //     case 'f':
    //         this.commandStrategies['f'].execute.call(this);
    //         break;
    //     case 'b':
    //         this.commandStrategies['b'].execute.call(this);
    //         break;
    // }

    this.commandStrategies[this.commands[0]].execute.call(this);
};