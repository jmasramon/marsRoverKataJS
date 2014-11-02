/*global describe,it, xit, assert, expect, beforeEach */
'use strict';
var marsrover = require('../lib/marsrover.js'),
    sinonChai = require('sinon-chai'),
    chai = require('chai');

global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = require('sinon');
chai.use(sinonChai);
/*jshint expr:true */

describe('marsrover node module.', function() {
    var Rover = marsrover.Rover;
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
    var X_RIGHT_LIMIT = Math.floor(INITIAL_ENV.grid.width/2);
    var X_LEFT_LIMIT = -Math.floor(INITIAL_ENV.grid.width/2);
    var Y_UPPER_LIMIT = Math.floor(INITIAL_ENV.grid.height/2);
    var Y_LOWER_LIMIT = -Math.floor(INITIAL_ENV.grid.height/2);

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

    it('should create rovers with an initial position and orientation', function() {
        expect(Rover).to.exist;
        expect(rover).to.exist;
        expect(rover.getPosition()).to.deep.equal({
            x: INITIAL_X,
            y: INITIAL_Y
        });
        assert.equal(rover.getOrientation(), INITIAL_ORI);
    });

    describe('The rover receives a character array of commands.', function() {
        it('should have a setCommands function', function() {
            expect(rover.setCommands).to.exist;
        });

        it('should accept a char array', function() {
            expect(rover.setCommands(['r', 'l', 'f'])).to.equal('Roger that!');
        });
    });

    describe('The rober obeys commands.', function() {
        describe('should Implement commands that move the rover forward/backward (f,b).', function() {
            describe('should go forward when f received.', function() {
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

            describe('should go backward when b received.', function() {
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

            describe('should accept poly-commands.', function() {

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

        describe('should implement commands that turn the rover left/right (l,r)', function() {
            describe('should turn left when l received', function() {
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

            describe('should turn right when r received', function() {
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

    describe('Implement wrapping from one edge of the grid to another (planets are spheres after all).', function() {
        describe('The rover should have a defined grid', function() {
            xit('should have a grid', function() {
                expect(rover.grid).to.exist;
            });
        });

        it('should wrap up when from upper border receives an f', function() {
            rover = new Rover({
                x: 0,
                y: Y_UPPER_LIMIT
            }, 'N');
            moveRover(['f']);
            chekcRoverStatus(0, -5, 'N');
        });

        it('should not wrap up when from upper border receives an b', function () {
            rover = new Rover({
                x: 0,
                y: Y_UPPER_LIMIT
            }, 'N');
            moveRover(['b']);
            chekcRoverStatus(0, 4, 'N');
        });

        it('should down wrap when from lower border receives an f', function() {
            rover = new Rover({
                x: 0,
                y: -5
            }, 'S');
            moveRover(['f']);
            chekcRoverStatus(0, 5, 'S');
        });

        it('should not down wrap when from lower border receives an b', function () {
            rover = new Rover({
                x: 0,
                y: -5
            }, 'S');
            moveRover(['b']);
            chekcRoverStatus(0, -4, 'S');
        });

        it('should wrap right when from right border receives an f', function() {
            rover = new Rover({
                x: 5,
                y: 0
            }, 'E');
            moveRover(['f']);
            chekcRoverStatus(-5, 0, 'E');
        });

        it('should not right wrap when from right border receives an b', function() {
            rover = new Rover({
                x: 5,
                y: 0
            }, 'E');
            moveRover(['b']);
            chekcRoverStatus(4, 0, 'E');
        });

        it('should left wrap when from left border receives an f', function() {
            rover = new Rover({
                x: -5,
                y: 0
            }, 'W');
            moveRover(['f']);
            chekcRoverStatus(5, 0, 'W');
        });

        it('should not left wrap when from left border receives an b', function() {
            rover = new Rover({
                x: -5,
                y: 0
            }, 'W');
            moveRover(['b']);
            chekcRoverStatus(-4, 0, 'W');
        });
        it('should go to (-5,-5,N) when from (5,5,N) receives an rflf', function() {
            rover = new Rover({
                x: 5,
                y: Y_UPPER_LIMIT
            }, 'N');
            moveRover(['r', 'f', 'l', 'f']);
            chekcRoverStatus(-5, -5, 'N');
        });
    });

    describe('Implement obstacle detection before each move to a new square. ' +
        'If a given sequence of commands encounters an obstacle, the rover moves up to the last possible point ' +
        'and reports the obstacle.',
        function() {

            describe('should accept obstacle initialization', function() {
                
                it('should be able to accept a list of obstacles', function() {
                    
                    expect(rover.bewareOfObstacles).to.exist;
                    
                    assert.equal(typeof rover.bewareOfObstacles, 'function', "bewareOfObstacles should be a function of the rover");
                    
                    expect(rover.bewareOfObstacles([{
                        x: 1,
                        y: 2
                    }])).to.equal('Roger that!');
                });

                it('should store a list of obstacles that gives back with getObstacles', function() {
                    
                    rover.bewareOfObstacles([{
                        x: 1,
                        y: 2
                    }, {
                        x: 4,
                        y: Y_UPPER_LIMIT
                    }]);
                    
                    expect(rover.getObstacles()).to.deep.equal([{
                        x: 1,
                        y: 2
                    }, {
                        x: 4,
                        y: Y_UPPER_LIMIT
                    }]);
                });
            });

            describe('Once obstacle list received, When receiving orders ...', function() {
                beforeEach(function () {
                    rover.bewareOfObstacles([{
                        x: 3,
                        y: 3
                    }, {
                        x: 4,
                        y: Y_UPPER_LIMIT
                    }]);
                });

                it('if obstacle in its right path, should stop and report obstacle', function () {
                    
                    
                    try{
                        moveRover(['f','r','f','f','f','l','f']);
                    } catch (err) {
                        expect(err.message).to.equal('Obstacle found!');    
                    }
                 });

                it('if obstacle in its upper path, should stop and report obstacle', function () {
                                       
                    try{
                        moveRover(['r','f','f','l','f','l','f']);
                    } catch (err) {
                        expect(err.message).to.equal('Obstacle found!');    
                    }

                });

                it('if obstacle in its left path, should stop and report obstacle', function () {
                                        
                    try{
                        moveRover(['r','f','f','f','l','f','l', 'f', 'f']);
                    } catch (err) {
                        expect(err.message).to.equal('Obstacle found!');    
                    }

                });

                it('if obstacle in its bottom path, should stop and report obstacle', function () {
                                        
                    try{
                        moveRover(['r','f','f','f','l','f','f', 'f', 'l','f','l','f','f']);
                    } catch (err) {
                        expect(err.message).to.equal('Obstacle found!');    
                    }

                });
            });
        });

    xit('expectation', function() {
        assert.isTrue(true, "obviously");
    });
});