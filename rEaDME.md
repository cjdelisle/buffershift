# BufferShift

Status: stable+unmaintained, open an issue if you would like to take over

[![Build Status](https://travis-ci.org/cjdelisle/buffershift.svg?branch=master)](https://travis-ci.org/cjdelisle/buffershift)

Bit Shift buffers in node.js

This library exposes 2 simple functions which will bitshift an entire buffer of arbitrary size
as if it were a bignum (but without the overhead of loading it in and out of a bignum library).

## BufferShift.shl(buffer, numBits)
Shift the buffer bits to the left: taken as a big-endian number, the number gets bigger.

## BufferShift.shr(buffer, numBits)
Shift the buffer bits to the right: taken as a big-endian number, the number gets smaller.

```javascript
const BufferShift = require('buffershift');
const x = new Buffer("00112233", "hex");
BufferShift.shl(x, 8);
console.log(x); // -> <Buffer 11 22 33 00>
BufferShift.shr(x, 16);
console.log(x); // -> <Buffer 00 00 11 22>
```

**NOTE:** The functions in this library mutate the input buffers. This point of this library is
to be fast so it doesn't make much sense to copy buffers every shift, if you want to keep your
buffers safe, copy them before shifting.

## Node Version
Tested on 4.2.1, 4.5.0 and 6.6.0

## License

MIT
