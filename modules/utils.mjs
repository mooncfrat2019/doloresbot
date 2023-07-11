import axios from 'axios';
import { config } from './config.mjs';
import { createRequire } from "module";

export function localTime() {
    return Math.round((new Date()).getTime() / 1000)/* + 10800*/;
}

export const compare = (key, a, b ) => {
    return (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
}

export const keyRemover = async (data, key) => {
    delete data[key]
}

export const requestAxios = async (props) => {
        try {
            let type = (props?.type) ? props.type : 'get';
            let body = (props?.data) ? props.data : null;
            let config = (props?.config) ? props?.config : null;
            return new Promise((resolve, reject) => {
                axios[type](props.url, body, config).then(data => {
                    resolve(data)
                }).catch(e => {
                    reject(e)
                });
            })
        } catch (e) {
            return new Promise((resolve, reject) => {
                reject(e)
            })
        }
}

export function timeMs() {
    return Math.round((new Date()).getTime())/* + 10800*/;
}

export const modulusIndex = ({ modulus = 10, maxIndex = 2, corrector = 6 }) => {
    const value = timeMs() % modulus;
    const temp = Math.abs(((value < maxIndex) ? value : value - corrector) - 1);
    return (temp > maxIndex) ? maxIndex : temp;
}

export const propertyByIndex = function (obj, index) {
    const keys = Object.keys(obj);
    return obj[keys[index]];
};

/**
 * Функция для вызова методов API VK;
 * @param method {string} Принимает название метода;
 * @param params {object} Принимает параметры метода как объект;
 * @returns {any} Возвращает объект response или массив;
 */
export const vkApi = async ({ method = 'users.get', params = { v: '5.130', access_token: config.BOT_TOKEN } }) => {
        try {
            params.lang = 'ru';
            const { data } = await requestAxios({ url: `https://api.vk.com/method/${method}?${getParams(params) }`, type: 'get' });
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(e);
        }
}
export const getParams = (obj) => new URLSearchParams(obj).toString();

export const isJson = (str) => {
    try { JSON.parse(str); } catch (e) { return false; }
    return true;
};
export const asyncHandler = fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next);

export const urlP = (url) => {
    try {
        const URLparams = new URLSearchParams(url);
        const m = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const p of URLparams) {
            m.push(p);
        }
        return Object.fromEntries(m);
    }
    catch (e) {
        console.log('urlP', e);
        return ({ error: 1, err_msg: 'Error in url parse'});
    }
};

export const asyncFilter = (array, fn, args) => Promise.all(array.map((data) => fn({ ...args, data })))
  .then((booleans) => array.filter((_, i) => booleans[i]));

export function cond (chain) {
    return {
        if (condition, thanF, elseF) {
            return cond(condition? thanF(chain) : (
              elseF? elseF(chain) : chain
            ))
        },
        chain (f) {
            return cond(f(chain))
        },
        end () {
            return chain
        }
    }
}

export const __text__tokenizer = (text, state) => {
    return text.split(" ").map((word) => {
        const wordIdentity = word.split('').map((letter) => {
            if (!state.letters[letter]) {
                state.letters[letter] = letter.charCodeAt(0);
            }
            return letter.charCodeAt(0);
        }).reduce((p, c) => p + c, 0);
        if (!state.words[word]) {
            state.words[word] = wordIdentity;
        }
        return wordIdentity;
    });
};

export const __deviation_byArray = (Item, Index, Array) => Math.floor((Array[Index] - Item) * 100 / Item);

export class Utils {
    constructor(props) {
        this.data = props.data
    }

    static typeOf = (any) => {
        let type = ({}).toString.call(any).match(/\s([a-zA-Z]+)/)[1]
        if (type === 'Object') {
            const results = (/^(function|class)\s+(\w+)/).exec(any.constructor.toString())
            type = (results && results.length > 2) ? results[2] : ''
        }
        return type
    }

    static rangePoints = (range = []) => {
        let min = range[0];
        let max = 0;
        let middle = 0;
        const r = range.length;
        middle = range.reduce((p, c) => {
            if (c > max) max = c;
            if (c < min) min = c;
            return p + c
        }, 0) / r;
        return ({ min, middle, max });
    }

    static require = createRequire(import.meta.url);

    static __tokenizerSimple = (text) => text.split('').map((letter) => letter.charCodeAt(0));

    static moveFloat = (number) => Number('0.' + number.toString().split('').filter((i) => i !== '.').join(''));

    static moveFloatBack = (number) => Number(number.toString()
      .split('0.')
      .filter((i) => i)
      .map((i) => i.split('').map((z, index) => (!index ? z + '.' : z)).join('')).join(''))
}

export const chunker = (array, size = 2) => {
    const tempArray = [];
    for (let i = 0; i < array.length; i += size) {
        tempArray.push(array.slice(i, i + size));
    }
    return tempArray
}