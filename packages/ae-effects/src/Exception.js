
import { createEffect, func } from '@algebraic-effects/core';

// Exception :: Effect
const Exception = createEffect('Exception', {
  throw: func(['error']),
});

// Exception.try :: Runner
Exception.try = Exception.handler({
  throw: ({ throwError }) => e => throwError(e),
});

export default Exception;
