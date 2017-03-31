/*@flow*/
'use strict';

const Crypto = require('crypto');
const BufferShift = require('./index');

// fuzz parameters...
const MAXLENBYTES = 16;
const MAXSHIFTBITS = 300;
const CYCLES = 100000;

const asBits = (buf) => {
    return buf.toString('hex').split('').map((h) => (Number('0xf'+h).toString(2).slice(4))).
        join('').split('').map(Number);
};

const asBuffer = (bits) => {
    return new Buffer(
        bits.join('').replace(/([01]{4})/g, (all, n) => (parseInt(n,2).toString(16))),
        'hex'
    );
};

const slowShift = (buf, count, left) => {
    if (count < 0) {
        count = -count;
        left = !left;
    }
    const bits = asBits(buf);
    if (count >= bits.length) {
        bits.fill(0);
    } else if (left) {
        bits.splice(0, count);
        Array.prototype.push.apply(bits, new Array(count).fill(0));
    } else {
        bits.splice(-count, count);
        Array.prototype.unshift.apply(bits, new Array(count).fill(0));
    }
    return asBuffer(bits);
};

const testCase = (input, count, left) => {
    const buf = new Buffer(input);
    try {
        const expect = slowShift(buf, count, left).toString('hex');
        ((left) ? BufferShift.shl : BufferShift.shr)(buf, count);
        const real = buf.toString('hex');
        if (expect !== real) {
            console.log('expected: ' + expect);
            console.log('got: ' + real);
            throw new Error();
        }
    } catch (e) {
        console.log('testCase(new Buffer("' + input.toString('hex') + '", "hex"), ' +
            count + ', ' + left.toString() + ')');
        throw e;
    }
};

const test = (hex, count) => {
    const b = new Buffer(hex, "hex");
    testCase(b, count, true);
    testCase(b, count, false);
};

const fuzz = () => {
    for (let i = 0; i < CYCLES; i++) {
        const input = Crypto.randomBytes((Math.random() * MAXLENBYTES) | 0);
        const count = (Math.random() * MAXSHIFTBITS) | 0;
        testCase(input, count, true);
        testCase(input, count, false);
        if (0 === (i % 1000)) {
            console.log("fuzzing: " + i);
        }
    }
};

test("", 14);
test("abcdef", 0);
test("abcdef", 24);
test("abcdef", 32);
test("abcd", 1);
test("abcd", 0);
test("abcd", 16);
test("ab", 0);
test("ab", 1);
test("ab", 8);
test("ab", 9);
test("ab", 16);
fuzz();
