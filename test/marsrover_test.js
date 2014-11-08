/*global describe,it, assert, expect, beforeEach */
'use strict';
var marsrover = require('../lib/marsrover.js'),
    map = require('../lib/map'),
    standardStrategy = require('../lib/standardStrategy'),
    sinonChai = require('sinon-chai'),
    chai = require('chai');

global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = require('sinon');
chai.use(sinonChai);
/*jshint expr:true */

describe('The marsrover node module.', function() {
    var Rover = marsrover.Rover;
    var Map = map.Map;
    var rover;
    var INITIAL_X = 1;
    var INITIAL_Y = 2;
    var INITIAL_ORI = 'N';
    var INITIAL_ENV = {
        grid: {
            height: 11,
            width: 11
        },
        obstacles: []
    };
    var X_RIGHT_LIMIT = Math.floor(INITIAL_ENV.grid.width / 2);
    var X_LEFT_LIMIT = -Math.floor(INITIAL_ENV.grid.width / 2);
    var Y_UPPER_LIMIT = Math.floor(INITIAL_ENV.grid.height / 2);
    var Y_LOWER_LIMIT = -Math.floor(INITIAL_ENV.grid.height / 2);

    function moveRover(command) {
        rover.setCommands(command);
        rover.executeCommands();
    }

    function orientAndMoveRover(orientation, command) {
        rover = new Rover({
            x: INITIAL_X,
            y: INITIAL_Y
        }, orientation, INITIAL_ENV);
        moveRover(command);
    }

    function chekcRoverStatus(x, y, orientation) {
        checkRoverPosition(x, y);
        checkRoverOrientation(orientation);
    }

    function checkRoverPosition(expX, expY) {
        expect(rover.getPosition()).to.deep.equal({
            x: expX,
            y: expY
        });
    }

    function checkRoverOrientation(orientation) {
        expect(rover.getOrientation()).to.equal(orientation);
    }

    beforeEach(function() {
        rover = new Rover({
            x: INITIAL_X,
            y: INITIAL_Y
        }, INITIAL_ORI, INITIAL_ENV);
    });

    it('It should create rovers with an initial position and orientation', function() {
        expect(Rover).to.exist;
        expect(rover).to.exist;
        expect(rover.getPosition()).to.deep.equal({
            x: INITIAL_X,
            y: INITIAL_Y
        });
        assert.equal(rover.getOrientation(), INITIAL_ORI);
    });

    describe('When rover receives a character array of commands. It ', function() {

        it('should have a setCommands function', function() {
            expect(rover.setCommands).to.exist;
        });

        it('should accept a char array as a list of command', function() {
            expect(rover.setCommands(['r', 'l', 'f'])).to.equal('Roger that!');
        });

        it('should reject other format of commands', function() {
            expect(rover.setCommands(['r', 3, 'f'])).to.equal('No comprende!');
            expect(rover.setCommands('rlf')).to.equal('No comprende!');
        });
    });

    describe('The rober obeys commands.', function() {

        describe('It should Implement commands that move the rover forward/backward (f,b).', function() {

            describe('It should go forward when f received. So it, ', function() {

                it('should increase y when looking north and f received', function() {
                    orientAndMoveRover('N', ['f']);
                    checkRoverPosition(INITIAL_X, INITIAL_Y + 1);
                });
                it('should increase x when looking east and f received', function() {
                    orientAndMoveRover('E', ['f']);
                    checkRoverPosition(INITIAL_X + 1, INITIAL_Y);
                });
                it('should decrease y when looking south and f received', function() {
                    orientAndMoveRover('S', ['f']);
                    checkRoverPosition(INITIAL_X, INITIAL_Y - 1);
                });
                it('should decrease x when looking west and f received', function() {
                    orientAndMoveRover('W', ['f']);
                    checkRoverPosition(INITIAL_X - 1, INITIAL_Y);
                });

            });

            describe('It should go backward when b received. So it, ', function() {

                it('should increase y when looking north and b received', function() {
                    orientAndMoveRover('N', ['b']);
                    checkRoverPosition(INITIAL_X, INITIAL_Y - 1);
                });

                it('should increase x when looking east and b received', function() {
                    orientAndMoveRover('E', ['b']);
                    checkRoverPosition(INITIAL_X - 1, INITIAL_Y);
                });

                it('should decrease y when looking south and b received', function() {
                    orientAndMoveRover('S', ['b']);
                    checkRoverPosition(INITIAL_X, INITIAL_Y + 1);
                });

                it('should decrease x when looking west and b received', function() {
                    orientAndMoveRover('W', ['b']);
                    checkRoverPosition(INITIAL_X + 1, INITIAL_Y);
                });

            });

            describe('When poly-commands received, it', function() {

                it('should go back to initial when fb received', function() {
                    orientAndMoveRover('N', ['f', 'b']);
                    checkRoverPosition(INITIAL_X, INITIAL_Y);
                });

                it('should go back to initial when bf received', function() {
                    orientAndMoveRover('N', ['b', 'f']);
                    checkRoverPosition(INITIAL_X, INITIAL_Y);
                });

                it('should go back to initial when any paired-combination of fs and bs', function() {
                    orientAndMoveRover('N', ['b', 'f', 'f', 'b']);
                    checkRoverPosition(INITIAL_X, INITIAL_Y);

                    orientAndMoveRover('N', ['b', 'b', 'b', 'f', 'f', 'f']);
                    checkRoverPosition(INITIAL_X, INITIAL_Y);

                });

                it('shoud advance as many times as fs or bs received', function() {
                    orientAndMoveRover('N', ['f', 'f', 'f']);
                    checkRoverPosition(INITIAL_X, INITIAL_Y + 3);


                });
            });
        });

        describe('It should implement commands that turn the rover left/right (l,r).', function() {

            describe('It should turn left when l received. So it, ', function() {

                it('should reorient W when N and l', function() {
                    orientAndMoveRover('N', ['l']);
                    checkRoverOrientation('W');
                });

                it('should reorient N when E and l', function() {
                    orientAndMoveRover('E', ['l']);
                    checkRoverOrientation('N');
                });

                it('should reorient E when N and lll', function() {
                    orientAndMoveRover('N', ['l', 'l', 'l']);
                    checkRoverOrientation('E');
                });

                it('should reorient W when N and lllll', function() {
                    orientAndMoveRover('N', ['l', 'l', 'l', 'l', 'l']);
                    checkRoverOrientation('W');
                });

            });

            describe('It should turn right when r received, so it', function() {

                it('should reorient E when N and r', function() {
                    orientAndMoveRover('N', ['r']);
                    checkRoverOrientation('E');
                });

                it('should reorient S when E and r', function() {
                    orientAndMoveRover('E', ['r']);
                    checkRoverOrientation('S');
                });

                it('should reorient N when N and rrrr', function() {
                    orientAndMoveRover('N', ['l', 'l', 'l', 'l']);
                    checkRoverOrientation('N');
                });

                it('should reorient E when N and rrrrr', function() {
                    orientAndMoveRover('N', ['r', 'r', 'r', 'r', 'r']);
                    checkRoverOrientation('E');
                });
            });
        });
    });

    describe('It should implement wrapping from one edge of the grid to another (planets are spheres after all). So it, ', function() {

        it('should wrap up when from upper border receives an f', function() {
            rover = new Rover({
                x: 0,
                y: Y_UPPER_LIMIT
            }, 'N');
            moveRover(['f']);
            chekcRoverStatus(0, Y_LOWER_LIMIT, 'N');
        });

        it('should not wrap up when from upper border receives an b', function() {
            rover = new Rover({
                x: 0,
                y: Y_UPPER_LIMIT
            }, 'N');
            moveRover(['b']);
            chekcRoverStatus(0, Y_UPPER_LIMIT - 1, 'N');
        });

        it('should down wrap when from lower border receives an f', function() {
            rover = new Rover({
                x: 0,
                y: Y_LOWER_LIMIT
            }, 'S');
            moveRover(['f']);
            chekcRoverStatus(0, Y_UPPER_LIMIT, 'S');
        });

        it('should not down wrap when from lower border receives an b', function() {
            rover = new Rover({
                x: 0,
                y: Y_LOWER_LIMIT
            }, 'S');
            moveRover(['b']);
            chekcRoverStatus(0, Y_LOWER_LIMIT + 1, 'S');
        });

        it('should wrap right when from right border receives an f', function() {
            rover = new Rover({
                x: X_RIGHT_LIMIT,
                y: 0
            }, 'E');
            moveRover(['f']);
            chekcRoverStatus(X_LEFT_LIMIT, 0, 'E');
        });

        it('should not right wrap when from right border receives an b', function() {
            rover = new Rover({
                x: X_RIGHT_LIMIT,
                y: 0
            }, 'E');
            moveRover(['b']);
            chekcRoverStatus(X_RIGHT_LIMIT - 1, 0, 'E');
        });

        it('should left wrap when from left border receives an f', function() {
            rover = new Rover({
                x: X_LEFT_LIMIT,
                y: 0
            }, 'W');
            moveRover(['f']);
            chekcRoverStatus(X_RIGHT_LIMIT, 0, 'W');
        });

        it('should not left wrap when from left border receives an b', function() {
            rover = new Rover({
                x: X_LEFT_LIMIT,
                y: 0
            }, 'W');
            moveRover(['b']);
            chekcRoverStatus(X_LEFT_LIMIT + 1, 0, 'W');
        });
        it('should go to (-5,-5,N) when from (5,5,N) receives an rflf', function() {
            rover = new Rover({
                x: X_RIGHT_LIMIT,
                y: Y_UPPER_LIMIT
            }, 'N');
            moveRover(['r', 'f', 'l', 'f']);
            chekcRoverStatus(X_LEFT_LIMIT, Y_LOWER_LIMIT, 'N');
        });
    });

    describe('It should implement obstacle detection before each move to a new square. ' +
        'If a given sequence of commands encounters an obstacle, the rover moves up to the last possible point ' +
        'and reports the obstacle.',
        function() {

            describe('It should accept obstacle initialization. So it, ', function() {

                it('should be able to accept a list of obstacles', function() {

                    expect(rover.setObstacles).to.exist;

                    assert.equal(typeof rover.setObstacles, 'function', "setObstacles should be a function of the rover");

                    expect(rover.setObstacles([{
                        x: 1,
                        y: 2
                    }])).to.equal('Roger that!');
                });

                it('should store a list of obstacles', function() {

                    rover.setObstacles([{
                        x: 1,
                        y: 2
                    }, {
                        x: 4,
                        y: Y_UPPER_LIMIT
                    }]);

                });

                it('should reject bad lists of obstacles', function() {
                    expect(rover.setObstacles(['a', (1, 2)])).to.equal('Bad obstacle list');
                });
            });

            describe('Once an obstacle list is received, when receiving orders, ', function() {

                beforeEach(function() {
                    rover.setObstacles([{
                        x: 3,
                        y: 3
                    }, {
                        x: 4,
                        y: Y_UPPER_LIMIT
                    }]);
                });

                it('if obstacle in its right path, should stop and report obstacle', function() {


                    try {
                        moveRover(['f', 'r', 'f', 'f', 'f', 'l', 'f']);
                    } catch (err) {
                        expect(err.message).to.equal('Obstacle found!');
                    }
                });

                it('if obstacle in its upper path, should stop and report obstacle', function() {

                    try {
                        moveRover(['r', 'f', 'f', 'l', 'f', 'l', 'f']);
                    } catch (err) {
                        expect(err.message).to.equal('Obstacle found!');
                    }

                });

                it('if obstacle in its left path, should stop and report obstacle', function() {

                    try {
                        moveRover(['r', 'f', 'f', 'f', 'l', 'f', 'l', 'f', 'f']);
                    } catch (err) {
                        expect(err.message).to.equal('Obstacle found!');
                    }

                });

                it('if obstacle in its bottom path, should stop and report obstacle', function() {

                    try {
                        moveRover(['r', 'f', 'f', 'f', 'l', 'f', 'f', 'f', 'l', 'f', 'l', 'f', 'f']);
                    } catch (err) {
                        expect(err.message).to.equal('Obstacle found!');
                    }

                });
            });
        });

    describe('It should allow injection of different maps and moving strategies', function() {
        var grid,
            obstacles;
        beforeEach(function() {
            grid = {
                height: 101,
                width: 101
            };
            obstacles = [{
                x: 3,
                y: 5
            }, {
                x: 1,
                y: Y_LOWER_LIMIT
            }];
        });

        it('should accept a different map', function() {
            rover.setMap(new Map(grid, obstacles));
        });

        describe('It should work properly with the new map. When new map, it', function() {
            it('should wrap up when from upper border receives an f', function() {
                rover = new Rover({
                    x: 0,
                    y: (101 - 1) / 2
                }, 'N');
                moveRover(['f']);
                chekcRoverStatus(0, -(101 - 1) / 2, 'N');
            });
        });

        it('should accept a different moving strategy', function() {
            rover.setMovingStrategies(standardStrategy.movingStrategies);
        });

        describe('It should work properly with the new strategy. When new strategy, it', function() {
            it('should enable new strategies through monkey patching', function() {
                var movingStrategies = standardStrategy.movingStrategies;

                movingStrategies.moveVertically = function(direction, position) {
                    if (direction === 'up') {
                        position.y += 2;
                    } else if (direction === 'down') {
                        position.y -= 2;
                    }
                };

                console.log('new Moving strategy = ');
                console.log(movingStrategies);
                var position = {
                    x: 0,
                    y: 0
                };
                movingStrategies.moveVertically('up', position);
                expect(position).to.deep.equal({
                    x: 0,
                    y: 2
                });


                rover = new Rover({
                    x: 0,
                    y: 0
                }, 'N');

                rover.setMovingStrategies(movingStrategies);

                moveRover(['f']);
                chekcRoverStatus(0, 2, 'N');
            });
        });
    });
});