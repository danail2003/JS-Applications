const assert = require('chai').assert;
const sumOfNumbers = require('./sumOfNumbers.js');

describe('sum', function () {
    it('should return sum', function () {
        let array = [1, 2];

        let result = sumOfNumbers(array);

        assert.equal(result, 3);
    });
    it('should return correct value', function () {
        let array = [1, 2, -3];

        let result = sumOfNumbers(array);

        assert.equal(result, 0);
    });
});

const isSymmetric = require('./checkForSymmetry.js');

describe('check array is symmetric', function () {
    it('should return true', function () {
        let array = [1, 2, 2, 1];

        let result = isSymmetric(array);

        assert.equal(result, true);
    });
    it('should return false is is not symmetric', function () {
        let array = [1, 2, 3, 4];

        let result = isSymmetric(array);

        assert.equal(result, false);
    });
    it('should return false if is not correct type', function () {
        let array = 'i am';

        let result = isSymmetric(array);

        assert.equal(result, false);
    });
});

const rgbToHex = require('./rgbToHex.js');

describe('RGB to HEX', function () {
    it('should return correct value', function () {
        let red = 2;
        let green = 5;
        let blue = 150;

        let result = rgbToHex(red, green, blue);

        assert.equal(result, '#020596');
    });
    it('should return undefined', function () {
        let red = '5';
        let green = 8;
        let blue = 15;

        let result = rgbToHex(red, green, blue);

        assert.equal(result, undefined);
    });
    it('should return undefined', function () {
        let red = 255;
        let green = 8;
        let blue = '78';

        let result = rgbToHex(red, green, blue);

        assert.equal(result, undefined);
    });
    it('should return undefined', function () {
        let red = 0;
        let green = false;
        let blue = 255;

        let result = rgbToHex(red, green, blue);

        assert.equal(result, undefined);
    });
    it('should return correct value', function () {
        let red = 0;
        let green = 0;
        let blue = 0;

        let result = rgbToHex(red, green, blue);

        assert.equal(result, '#000000');
    });
    it('should return correct value', function () {
        let result = rgbToHex(255, 255, 255);

        assert.equal(result, '#FFFFFF');
    });
    it('should return undefined', function () {
        let result = rgbToHex(780, 0, 255);

        assert.equal(result, undefined);
    });
    it('should return undefined', function () {
        let result = rgbToHex(255, 541, 58);

        assert.equal(result, undefined);
    });
    it('should return undefined', function () {
        let result = rgbToHex(45, 325, 5);

        assert.equal(result, undefined);
    });
});

let calculator = require('./addSubtract.js');

describe('check calculator whether work correctly', function () {
    let calc;
    beforeEach(function () {
        calc = calculator();
    });

    it('should return 0', function () {
        let value = calc.get();

        assert.equal(value, 0);
    });
    it('should return correct value after add', function () {
        calc.add(2);
        calc.add(3);

        let value = calc.get();

        assert.equal(value, 5);
    });
    it('should return correct value after add and subtract', function () {
        calc.add(10);
        calc.subtract(5);

        let value = calc.get();

        assert.equal(value, 5);
    });
    it('should return correct value after and subtract', function () {
        calc.add(2);
        calc.subtract(5);
        calc.add(3);
        calc.subtract(2);

        let value = calc.get();

        assert.equal(value, -2);
    });
});