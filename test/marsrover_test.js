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

    function orientAndMoveRover(orientation, command) {
        rover = new Rover(INITIAL_X, INITIAL_Y, orientation);
        rover.setCommands([command]);
        rover.executeCommands();
    }

    function checkRoverPosition(expX, expY) {
        expect(rover.getPosition()).to.deep.equal({
            x: expX,
            y: expY
        });
    }

    beforeEach(function() {
        rover = new Rover(INITIAL_X, INITIAL_Y, INITIAL_ORI);
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
            expect(Rover.prototype.setCommands).to.exist;
        });

        xit('should recognize a string as a instanceof String', function() {
            assert.equal(typeof 'actual' === 'string', true, "[message]");
        });

        it('should accept a char array', function() {
            expect(rover.setCommands(['r', 'l', 'f'])).to.equal('Roger that!');
        });
    });

    describe('the rober obeys commands', function() {
        describe('should Implement commands that move the rover forward/backward (f,b)', function() {
            describe('should go forward when f received', function() {
                it('should increase y when looking north and f received', function() {
                    orientAndMoveRover('N', 'f');

                    checkRoverPosition(INITIAL_X, INITIAL_Y + 1);
                });
                it('should increase x when looking east and f received', function() {
                    orientAndMoveRover('E', 'f');

                    checkRoverPosition(INITIAL_X + 1, INITIAL_Y);
                });
                it('should decrease y when looking south and f received', function() {
                    orientAndMoveRover('S', 'f');

                    checkRoverPosition(INITIAL_X, INITIAL_Y - 1);
                });
                it('should decrease x when looking west and f received', function() {
                    orientAndMoveRover('W', 'f');

                    checkRoverPosition(INITIAL_X - 1, INITIAL_Y);
                });

            });

            describe('should go backward when b received', function() {
                it('should increase y when looking north and b received', function() {
                    orientAndMoveRover('N', 'b');

                    checkRoverPosition(INITIAL_X, INITIAL_Y - 1);
                });
                it('should increase x when looking east and b received', function() {
                    orientAndMoveRover('E', 'b');

                    checkRoverPosition(INITIAL_X - 1, INITIAL_Y);
                });
                it('should decrease y when looking south and b received', function() {
                    orientAndMoveRover('S', 'b');

                    checkRoverPosition(INITIAL_X, INITIAL_Y + 1);
                });
                it('should decrease x when looking west and b received', function() {
                    orientAndMoveRover('W', 'b');

                    checkRoverPosition(INITIAL_X + 1, INITIAL_Y);
                });

            });

            describe('should go back to initial state when fb or bf received', function() {

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
    });

    xit('expectation', function() {
        assert.isTrue(true, "obviously");
    });
});