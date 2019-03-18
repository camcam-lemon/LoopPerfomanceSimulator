import produce from 'immer';
import $ from 'jquery';
import _ from 'underscore';
import __ from 'lodash';

let array = [];
const map = new Map();
const set = new Set();

// 配列とコレクションの生成
const initialize = size => {
    for (let i = 0, l = size; i < l; i++) {
        array.push(i);
        map.set(`key${i}`, i);
        set.add(i);
    }
};

// 配列とコレクションのリセット
const cleanUp = () => {
    array = [];
    map.clear();
    set.clear();
};

// for文
const calcFor = arr => {
    let result = 0;
    for (let i = 0, l = arr.length; i < l; i++) {
        result += arr[i];
    }
    return result;
};

// while文
const calcWhile = arr => {
    let result = 0;
    let i = 0;
    while (i < arr.length) {
        result += arr[i++];
    }
    return result;
};

// do-while文
const calcDoWhile = arr => {
    let result = 0;
    let i = 0;
    do {
        result += arr[i++];
    } while (i < arr.length);
    return result;
};

// for...of
const calcForOf = arr => {
    let result = 0;
    for (const key of arr) {
        result += key;
    }
    return result;
};

/*  **slowest**  */
// for...in
// const calcForIn = arr => {
//     let result = 0;
//     for (const key in arr) {
//         result += parseInt(key);
//     }
//     return result;
// };

// Array.prototype.reducer
const calcReduce = arr => {
    return arr.reduce((acm, cur) => (acm += cur), 0);
};

// Array.prototype.forEach
const calcForEach = arr => {
    let result = 0;
    arr.forEach(key => (result += key));
    return result;
};

// Array.prototype.map
const calcMap = arr => {
    let result = 0;
    arr.map(key => (result += key));
    return result;
};

// new Map
const calcNewMapForEach = () => {
    let result = 0;
    map.forEach(key => (result += key));
    return result;
};

// new Set-froEach
const calcNewSetForEach = () => {
    let result = 0;
    set.forEach(key => (result += key));
    return result;
};

// new Set-for...of
const calcNewSetForOf = () => {
    let result = 0;
    for (const key of set) {
        result += key;
    }
    return result;
};

// jQuery.Each
const calcJQueryEach = arr => {
    let result = 0;
    $.each(arr, (i, key) => (result += key));
    return result;
};

// underscore.each
const calcUnderscoreEach = arr => {
    let result = 0;
    _.each(arr, key => (result += key));
    return result;
};

// underscore.map
const calcUnderscoreMap = arr => {
    let result = 0;
    _.map(arr, key => (result += key));
    return result;
};

// underscore.reduce
const calcUnderscoreReduce = arr => {
    return _.reduce(arr, (acm, cur) => (acm += cur), 0);
};

// lodash.forEach
const calcLodashForEach = arr => {
    let result = 0;
    __.forEach(arr, key => (result += key));
    return result;
};

// lodash.map
const calcLodashMap = arr => {
    let result = 0;
    __.map(arr, key => (result += key));
    return result;
};

// lodash.reduce
const calcLodashReduce = arr => {
    return __.reduce(arr, (acm, cur) => (acm += cur), 0);
};

const allFuncs = [
    calcFor,
    calcWhile,
    calcDoWhile,
    calcForOf,
    calcMap,
    calcForEach,
    calcReduce,
    calcNewMapForEach,
    calcNewSetForEach,
    calcNewSetForOf,
    calcJQueryEach,
    calcUnderscoreMap,
    calcUnderscoreEach,
    calcUnderscoreReduce,
    calcLodashMap,
    calcLodashForEach,
    calcLodashReduce,
];

const createTemplateRanking = () => {
    const obj = {};
    for (const func of allFuncs) {
        obj[func.name.slice(4)] = {
            first: 0,
            second: 0,
            third: 0,
        };
    }
    return obj;
};
const createTemplateAverageTime = () => {
    const obj = {};
    for (const func of allFuncs) {
        obj[func.name.slice(4)] = 0;
    }
    return obj;
};

const TEMPLATE_RANKING = createTemplateRanking();
const TEMPLATE_AVERAGE_TIME = createTemplateAverageTime();

const getPerfTime = func => {
    const start = performance.now();
    func(array);
    const end = performance.now();

    return { name: func.name.slice(4), time: end - start };
};

const sortAsc = arr => {
    const result = [...arr];

    result.sort((a, b) => (a.time < b.time ? -1 : 1));
    return result;
};

const labeling = arr => {
    let rank = 1;

    return arr.map((key, index, _arr) => {
        if (index === 0) return { ...key, rank };
        if (_arr[index - 1] && key.time === _arr[index - 1].time) return { ...key, rank };
        return { ...key, rank: ++rank };
    });
};

const exector = () => {
    const result = allFuncs.map(func => getPerfTime(func));
    const sortedResult = sortAsc(result);
    const labeledRank = labeling(sortedResult);
    return labeledRank;
};

const filterFastestThreeFuncs = arr => {
    return arr.map(result => result.filter(({ rank }) => rank <= 3));
};

const addRank = rank => {
    switch (rank) {
        case 1:
            return 'first';
        case 2:
            return 'second';
        case 3:
            return 'third';
    }
};

const calcAvarageTimeExecuting = arr => {
    return arr.reduce((prev, cur) => {
        const obj = { ...prev };
        cur.forEach(({ name, rank }) => {
            const key = addRank(rank);
            obj[name] = {
                ...obj[name],
                [key]: obj[name][key] + 1,
            };
        });
        return obj;
    }, TEMPLATE_RANKING);
};

const transformObjectToArray = obj => {
    const keys = Object.keys(obj);
    return keys.map(key => ({ [key]: obj[key] }));
};

const sortRank = (arr, target = 'first') => {
    const result = produce(arr, draft => {
        draft.sort((a, b) => {
            const [aFuncName] = Object.keys(a);
            const [bFuncName] = Object.keys(b);
            return a[aFuncName][target] > b[bFuncName][target] ? -1 : 1;
        });
    });
    return result;
};

const filterTopThree = (arr, target = 'first') => {
    let snapper = 1;
    let prev = 0;
    let cur = 0;
    return arr.reduce(
        (acm, result, index) => {
            if (snapper >= 4) return acm;

            const [key] = Object.keys(result);
            if (index === 0) {
                prev = result[key][target];
                cur = result[key][target];
                return produce(acm, draft => ({
                    ...draft,
                    first: {
                        count: result[key][target],
                        func: key,
                    },
                }));
            }

            cur = result[key][target];
            if (prev === cur) {
                const snapKey = addRank(snapper);
                return produce(acm, draft => ({
                    ...draft,
                    [snapKey]: {
                        ...acm[snapKey],
                        func: `${draft[snapKey].func}, ${key}`,
                    },
                }));
            } else {
                prev = result[key][target];
                snapper++;
                if (snapper === 4) return acm;
                const snapKey = addRank(snapper);
                return produce(acm, draft => ({
                    ...draft,
                    [snapKey]: {
                        count: result[key][target],
                        func: key,
                    },
                }));
            }
        },
        {
            first: { count: 0, func: '' },
            second: { count: 0, func: '' },
            third: { count: 0, func: '' },
        },
    );
};

const replaceAvarageToFastest = (result, target = 'first') => {
    const r = transformObjectToArray(result);
    const rr = sortRank(r, target);
    const rrr = filterTopThree(rr, target);
    return rrr;
};

const sumOfAllTime = result => {
    return result.reduce((acm, cur) => {
        const obj = { ...acm };
        for (const result of cur) {
            const { name, time } = result;
            obj[name] = obj[name] + time;
        }
        return obj;
    }, TEMPLATE_AVERAGE_TIME);
};

const calcAverage = (result, roop) => {
    const r = transformObjectToArray(result);
    return r.map(_r => {
        const [key] = Object.keys(_r);
        return { [key]: _r[key] / roop };
    });
};

const sortFastest = arr => {
    return produce(arr, draft => {
        draft.sort((a, b) => {
            const [aFuncName] = Object.keys(a);
            const [bFuncName] = Object.keys(b);
            return a[aFuncName] < b[bFuncName] ? -1 : 1;
        });
    });
};

const transformArrayToObject = arr => {
    return arr.reduce((acm, cur) => {
        const [key] = Object.keys(cur);
        return { ...acm, [key]: { average: cur[key] } };
    }, {});
};

const ranking = result => {
    const r = filterFastestThreeFuncs(result);
    const rr = calcAvarageTimeExecuting(r);
    const rrr = replaceAvarageToFastest(rr);
    console.table(rrr);
    return rrr;
};

const average = (result, roop) => {
    const t = sumOfAllTime(result);
    const tt = calcAverage(t, roop);
    const ttt = sortFastest(tt);
    const tttt = transformArrayToObject(ttt);
    console.table(tttt);
    return tttt;
};

const main = (size, roop) => {
    initialize(size);
    const result = [];
    for (let i = 0; i < roop; i++) {
        result.push(exector());
    }

    const rank = ranking(result);
    const avg = average(result, roop);
    cleanUp();
    return { ranking: rank, average: avg };
};

// 簡易版
// const exec = func => {
//     const start = performance.now();
//     const re = func(array);
//     const end = performance.now();

//     console.log(`${func.name.padEnd(20, ' ')}: ${end - start}, result: ${re}`);
// };

// const simplyMesure = () => {
//     console.log(`measure performance in array loop`);
//     console.log(`array length : ${array.length}`);
//     console.log('');
//     exec(calcFor);
//     exec(calcWhile);
//     exec(calcDoWhile);
//     exec(calcForOf);
//     exec(calcMap);
//     exec(calcForEach);
//     exec(calcReduce);
//     exec(calcNewMapForEach);
//     exec(calcNewSetForEach);
//     exec(calcNewSetForOf);
//     exec(calcJQueryEach);
//     exec(calcUnderscoreEach);
//     exec(calcUnderscoreMap);
//     exec(calcUnderscoreReduce);
//     exec(calcLodashForEach);
//     exec(calcLodashMap);
//     exec(calcLodashReduce);
// }

export default main;
