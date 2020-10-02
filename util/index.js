const path = require("path");
const glob = require("glob");
const _ = require("lodash");
const chalk = require("chalk");

const isPromise = require("is-promise");
const mapObject = require("map-obj");

const deepObjKeys = function (obj) {
  let keys = [];
  Object.keys(obj).forEach((key) => {
    if (_.isObject(obj[key])) {
      const subkeys = deepObjKeys(obj[key]);
      keys = keys.concat(subkeys.map((subkey) => key + "." + subkey));
    } else {
      keys.push(key);
    }
  });
  return keys;
};

const deepMapObj = function (obj, fn) {
  return mapObject(obj, (key, value) => fn(key, value), { deep: "true" });
};

const chainFns = async (fnNames, fnArray, initialValue, config) => {
  if (Array.isArray(fnNames)) {
    const fns = fnNames.map((x) => fnArray[x]);
    return fns.reduce((fromPrev, fn) => {
      if (isPromise(fromPrev)) {
        return Promise.resolve(fromPrev).then((res) => fn(res, config));
      }
      return fn(fromPrev, config);
    }, initialValue);
  } else if (_.isString(fnNames)) {
    return fnArray[fnNames](initialValue, config);
  } else {
    return initialValue;
  }
};

const requireFns = (type) =>
  glob
    .sync(`./${type}/**/*.js`)
    .reduce((obj, file) => Object.assign(obj, require(path.resolve(file))), {});

const pascalCase = (str) => _.startCase(_.camelCase(str)).replace(/ /g, "");

const mergeByKey = (arr1, arr2, key) => {
  const mergeDeep = (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (_.isObject(target) && _.isObject(source)) {
      for (const key in source) {
        if (_.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return Object.values(mergeDeep(target, ...sources));
  };

  const arr1Keyed = arr1.reduce(
    (acc, cur) => ({ ...acc, [cur[key]]: cur }),
    {}
  );
  const arr2Keyed = arr2.reduce(
    (acc, cur) => ({ ...acc, [cur[key]]: cur }),
    {}
  );
  return mergeDeep(arr1Keyed, arr2Keyed);
};

const logSuccess = (msg) => console.log(`${chalk.green("\u2714")} ${msg}`);

module.exports = {
  deepMapObj,
  deepObjKeys,
  chainFns,
  requireFns,
  pascalCase,
  mergeByKey,
  logSuccess,
};
