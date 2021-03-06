"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@algebraic-effects/core");

var Logger = (0, _core.createEffect)('Logger', {
  log: (0, _core.func)(['label', 'data'], 'data'),
  message: (0, _core.func)(['...msg']),
  info: (0, _core.func)(['info']),
  error: (0, _core.func)(['e']),
  warn: (0, _core.func)(['e'])
});

Logger.from = function (loggerInterface) {
  var noop = function noop() {};

  var logger = loggerInterface || {
    log: function log(_, d) {
      return d;
    },
    error: noop,
    warn: noop,
    info: noop
  };
  return Logger.handler({
    log: function log(_ref) {
      var resume = _ref.resume;
      return function (label, data) {
        logger.log(label, data);
        resume(data);
      };
    },
    message: function message(_ref2) {
      var resume = _ref2.resume;
      return function () {
        return resume(logger.log.apply(logger, arguments));
      };
    },
    info: function info(_ref3) {
      var resume = _ref3.resume;
      return function (str) {
        return resume(logger.info(str));
      };
    },
    error: function error(_ref4) {
      var resume = _ref4.resume;
      return function (e) {
        return resume(logger.error(e));
      };
    },
    warn: function warn(_ref5) {
      var resume = _ref5.resume;
      return function (e) {
        return resume(logger.warn(e));
      };
    }
  });
};

var _default = Logger;
exports.default = _default;