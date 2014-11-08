/*
 *
 * user/repo
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

require('array.prototype.find');
var map = require('./map');
var standardStrategy = require('./standardStrategy');

/* jshint unused: true, node: true */

(function() {
    var Map = map.Map;


    // PRIVATE ATTRIBUTES /////////////////////////////////
    var position = {
            x: 0,
            y: 0
        },
        orientation = {
            cardinality: 'N'
        },
        commands,
        marsMap = {
            grid: {},
            obstacles: []
        },
        movingStrategies;

    position.toString = function() {
        return '(x:' + this.x + ' , y:' + this.y + ')';
    };

    orientation.toString = function() {
        return '' + this.cardinality;
    };

    // API ////////////////////////////////////////////////
    exports.Rover = function(_pos_, _cardinality_, _marsMap_, _movingStrategies_) {
        position.x = _pos_.x;
        position.y = _pos_.y;


        orientation.cardinality = _cardinality_;

        commands = [];


        if (_movingStrategies_) {
            movingStrategies = _movingStrategies_;
        } else {
            movingStrategies = standardStrategy.movingStrategies;
            // console.log('movingStrategies is an ' + movingStrategies);
        }

        marsMap = new Map();
        if (_marsMap_) {
            marsMap.grid = _marsMap_.grid;
            marsMap.obstacles = _marsMap_.obstacles;
        } 

        standardStrategy.setMap(marsMap);

    };

    var exp = exports.Rover.prototype;

    exp.getPosition = function() {
        return {
            x: position.x,
            y: position.y
        };
    };

    exp.getOrientation = function() {
        return orientation.cardinality;
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

    exp.setMovingStrategies = function(_movingStrategies_) {
        movingStrategies = _movingStrategies_;
    };

    exp.executeCommands = function() {
        var currentCommandName;
        try {
            for (var command in commands) {
                currentCommandName = commands[command];
                // console.log('executeCommand status: command = ' + currentCommandName + ', orientation = ' + orientation + ', position = ' + position);
                movingStrategies[currentCommandName].call(this, orientation, position);
            }
        } catch (err) {
            throw err;
        }
    };

    exp.setObstacles = function(newObstacles) {
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


})();