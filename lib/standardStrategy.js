/*
 *
 * user/repo
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

/* jshint unused: true, node: true */

(function() {
    // CONSTANTS //////////////////////////////////////////
    var CARDINAL_POINTS = 'NESW';

    var map;


    exports.movingStrategies = {
        'f': function(orientation, position) {
            forwardTactics[orientation.cardinality](position);
        },
        'b': function(orientation, position) {
            backwardTactics[orientation.cardinality](position);
        },
        'l': function(orientation) {
            exports.movingStrategies.turnLeft(orientation);
        },
        'r': function(orientation) {
            exports.movingStrategies.turnRight(orientation);
        }
    };

    exports.setMap = function(newMap) {
        map = newMap;
    };

    exports.movingStrategies.moveVertically = function (direction, position) {
        moveVertically(direction, position);
    };

    exports.movingStrategies.moveHorizontally = function (direction, position) {
        moveHorizontally(direction, position);
    };

    exports.movingStrategies.turnRight = function(orientation) {
        turnRight(orientation);
    };
    
    exports.movingStrategies.turnLeft = function(orientation) {
        turnLeft(orientation);
    };


    function moveVertically(direction, position) {
        if (map.needToWrap(direction,position)){
            wrapVertically(position);
        } else if (direction === 'up') {
            position.y += 1;
        } else if (direction === 'down') {
            position.y -= 1;
        }
    }
    
    function moveHorizontally(direction, position) {
        if (map.needToWrap(direction,position)){
            wrapHorizontally(position);
        } else if (direction === 'right') {
            position.x += 1;
        } else if (direction === 'left') {
            position.x -= 1;
        }
    }

    function turnRight(orientation) {
        if (atOrientationsRightLimit(orientation)) {
            orientation.cardinality = CARDINAL_POINTS[0];
        } else {
            orientation.cardinality = CARDINAL_POINTS[CARDINAL_POINTS.indexOf(orientation.cardinality) + 1];
        }
    }

    function turnLeft(orientation) {
        if (atOrientationsLeftLimit(orientation)) {
            orientation.cardinality = CARDINAL_POINTS[CARDINAL_POINTS.length - 1];
        } else {
            orientation.cardinality = CARDINAL_POINTS[CARDINAL_POINTS.indexOf(orientation.cardinality) - 1];
        }
    }

    var forwardTactics = {
        'N': function(position) {
            exports.movingStrategies.moveVertically('up', position);
        },
        'E': function(position) {
            exports.movingStrategies.moveHorizontally('right', position);
        },
        'S': function(position) {
            exports.movingStrategies.moveVertically('down', position);
        },
        'W': function(position) {
            exports.movingStrategies.moveHorizontally('left', position);
        }
    };

    var backwardTactics = {
        'N': function(position) {
            exports.movingStrategies.moveVertically('down', position);
        },
        'E': function(position) {
            exports.movingStrategies.moveHorizontally('left', position);
        },
        'S': function(position) {
            exports.movingStrategies.moveVertically('up', position);
        },
        'W': function(position) {
            exports.movingStrategies.moveHorizontally('right', position);
        }
    };

    function atOrientationsRightLimit(orientation) {
        return (CARDINAL_POINTS.indexOf(orientation.cardinality) + 1 === CARDINAL_POINTS.length);
    }

    function atOrientationsLeftLimit(orientation) {
        return (CARDINAL_POINTS.indexOf(orientation.cardinality) - 1 < 0);
    }

    function wrapVertically(position) {
        position.y = -position.y;
    }

    function wrapHorizontally(position) {
        position.x = -position.x;
    }



})();