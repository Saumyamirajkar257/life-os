// @ts-nocheck
globalThis.import = { meta: { env: { VITE_APP_ENV: 'development', MODE: 'development' } } };

import { AuraAgentDispatcher } from './src/features/ai/agent/auraAgentDispatcher';

async function test() {
  const result1 = await AuraAgentDispatcher.dispatch('add money i got salary 1000');
  console.log('Result 1:', result1);

  const result2 = await AuraAgentDispatcher.dispatch('add a new task buy groceries !high');
  console.log('Result 2:', result2);

  const result3 = await AuraAgentDispatcher.dispatch('i completed task buy groceries');
  console.log('Result 3:', result3);
}

test().catch(console.error);
