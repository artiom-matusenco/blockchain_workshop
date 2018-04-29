'use strict';

/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const processFn = (fn, opts) => function () {
  const P = opts.promiseModule;
  const args = new Array(arguments.length);

  for (let i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }

  return new P((resolve, reject) => {
    if (opts.errorFirst) {
      args.push(function (err, result) {
        if (opts.multiArgs) {
          const results = new Array(arguments.length - 1);

          for (let i = 1; i < arguments.length; i++) {
            results[i - 1] = arguments[i];
          }

          if (err) {
            results.unshift(err);
            reject(results);
          } else {
            resolve(results);
          }
        } else if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else {
      args.push(function (result) {
        if (opts.multiArgs) {
          const results = new Array(arguments.length - 1);

          for (let i = 0; i < arguments.length; i++) {
            results[i] = arguments[i];
          }

          resolve(results);
        } else {
          resolve(result);
        }
      });
    }

    fn.apply(this, args);
  });
};

window.pify= (obj, opts) => {
  opts = Object.assign({
    exclude: [/.+(Sync|Stream)$/],
    errorFirst: true,
    promiseModule: Promise
  }, opts);

  const filter = key => {
    const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);
    return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
  };

  let ret;
  if (typeof obj === 'function') {
    ret = function () {
      if (opts.excludeMain) {
        return obj.apply(this, arguments);
      }

      return processFn(obj, opts).apply(this, arguments);
    };
  } else {
    ret = Object.create(Object.getPrototypeOf(obj));
  }

  for (const key in obj) { // eslint-disable-line guard-for-in
    const x = obj[key];
    ret[key] = typeof x === 'function' && filter(key) ? processFn(x, opts) : x;
  }

  return ret;
};
