import { race as raceTasks, parallel as runInParallel } from '@algebraic-effects/task/fns';
import { identity } from '@algebraic-effects/utils';
import { Operation, func } from './utils';

// handleTask :: (...a -> Task e b) -> FlowOperators -> (...a) -> CancelFunction
const handleTask = fn => o => (...args) => fn(o)(...args).fork(o.throwError, o.resume);

const genericOpHandlers = {
  sleep: ({ resume }) => duration => setTimeout(resume, duration),
  awaitPromise: ({ promise }) => promise,
  runTask: ({ resume, throwError }) => t => t.fork(throwError, resume),
  call: handleTask(({ call }) => (p, ...a) => call(p, ...a)),
  resolve: ({ end }) => v => end(v),
  race: handleTask(({ call }) => programs => raceTasks(programs.map(p => call(p)))),
  parallel: handleTask(({ call }) => programs => runInParallel(programs.map(p => call(p)))),
  background: ({ call, resume }) => (p, ...a) => resume(call(p, ...a).fork(identity, identity)),
};

// * :: Operation
export const sleep = Operation('sleep', func(['duration']));
export const resolve = Operation('resolve', func(['*']));
export const awaitPromise = Operation('awaitPromise', func(['promise e a'], 'a'));
export const runTask = Operation('runTask', func(['task e a'], 'a'));

export const call = Operation('call', func(['generator ...a b', '...a'], 'b'));
export const race = Operation('race', func(['...(generator ...a b)'], 'b'));
export const parallel = Operation('parallel', func(['...(generator ...a b)'], '[b]'));
export const background = Operation('background', func(['...(generator ...a b)'], '[b]'));

// createGenericEffect :: (String, OpSignature, OpBehavior) -> Operation
export const createGenericEffect = (name, signature, handler) => {
  genericOpHandlers[name] = handler;
  return Operation(name, signature);
};

export default genericOpHandlers;
