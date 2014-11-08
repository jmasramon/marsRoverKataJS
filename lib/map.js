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

    var grid = {
            height: 11,
            width: 11
        },
        obstacles = [];

    grid.toString = function() {
        return '(height: '+ this.height+', width: '+ this.width+')';
    };

    exports.Map = function(_grid_, _obstacles_) {
        if (_grid_) {
            grid.height = _grid_.height;
            grid.width = _grid_.width;
        }

        if (_obstacles_) {
            obstacles = _obstacles_;
        } 
    };

    var exp = exports.Map.prototype;

    exp.getVerticalBorder = function() {
        return getVerticalBorder();
    };

    exp.getHorizontalBorder = function() {
        return getHorizontalBorder();
    };

    exp.noObstacleAhead = function(posX, posY) {
        return !obstacles.find(function(element) {
            return (element.x === posX && element.y === posY);
        });
    };

    exp.obstaclesAreCorrect = function(obstaclesToCheck) {
        if (!(obstaclesToCheck && obstaclesToCheck instanceof Array)) {
            return false;
        }
        for (var obstacle in obstaclesToCheck) {
            if (typeof obstaclesToCheck[obstacle] !== 'object') {
                return false;
            }
        }
        return true;
    };

    exp.needToWrap = function(direction, position) {
        return (direction === 'up' && inTopBorder(position)) ||
            (direction === 'down' && inBottomBorder(position)) ||
            (direction === 'right' && inRightBorder(position)) ||
            (direction === 'left' && inLeftBorder(position));
    };

    function inTopBorder(position) {
        return (inVerticalBorder(position) && position.y > 0);
    }

    function inBottomBorder(position) {
        return (inVerticalBorder(position) && position.y < 0);
    }

    function inRightBorder(position) {
        return (inHorizontalBorder(position) && position.x > 0);
    }

    function inLeftBorder(position) {
        return (inHorizontalBorder(position) && position.x < 0);
    }

    function inVerticalBorder(position) {
        return (Math.abs(position.y) === getVerticalBorder());
    }

    function inHorizontalBorder(position) {
        return (Math.abs(position.x) === getHorizontalBorder());
    }

    function getVerticalBorder() {
        return Math.floor(grid.height / 2);
    }

    function getHorizontalBorder() {
        return Math.floor(grid.width / 2);
    }


})();