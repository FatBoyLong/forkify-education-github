// This file is created for making functions which we will reuse in many places in our application

import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // AJAX call to Jonas` API using Fetch API
    // After refactoring made race between 2 promises - fetch, and timeout. Timout returns rejected promise if its left amount of seconds
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    // Making JSON from returned promise of res
    const data = await res.json();

    // ok - key of returned promise of res
    // if it`s false, making new Error with text from data
    // data is JSON from promise
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // throw new error for handling this error in model
    throw err;
  }
};



// export const getJSON = async function (url) {
//   try {
//     // AJAX call to Jonas` API using Fetch API
//     // After refactoring made race between 2 promises - fetch, and timeout. Timout returns rejected promise if its left amount of seconds
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

//     // Making JSON from returned promise of res
//     const data = await res.json();

//     // ok - key of returned promise of res
//     // if it`s false, making new Error with text from data
//     // data is JSON from promise
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     // throw new error for handling this error in model
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     // AJAX call to Jonas` API using Fetch API
//     // After refactoring made race between 2 promises - fetch, and timeout. Timout returns rejected promise if its left amount of seconds
//     const res = await Promise.race([
//       fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(uploadData),
//       }),
//       timeout(TIMEOUT_SEC),
//     ]);

//     // Making JSON from returned promise of res
//     const data = await res.json();

//     // ok - key of returned promise of res
//     // if it`s false, making new Error with text from data
//     // data is JSON from promise
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     // throw new error for handling this error in model
//     throw err;
//   }
// };
