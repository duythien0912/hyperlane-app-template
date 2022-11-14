import {
  ChainMap,
  ChainName,
  HyperlaneCore,
  MultiProvider,
  buildContracts,
  getChainToOwnerMap,
  objMap,
} from '@hyperlane-xyz/sdk';

import { HelloWorldApp } from '../app/app';
import { HelloWorldContracts, helloWorldFactories } from '../app/contracts';
import { HelloWorldChecker } from '../deploy/check';
import { prodConfigs } from '../deploy/config';

// COPY FROM OUTPUT OF DEPLOYMENT SCRIPT OR IMPORT FROM ELSEWHERE
const deploymentAddresses = {"alfajores":{"router":"0x09653D0D74d8B121Dfd5E700454BfA07a5a59b49"},"fuji":{"router":"0x7c98209a47919D770e4c9FE72a66aEac56888654"}};

// SET CONTRACT OWNER ADDRESS HERE
const ownerAddress = '0xC8f241D09E9cf0ea69567D37CC9E885172CADb93';

async function check() {
  console.info('Preparing utilities');
  const chainProviders = objMap(prodConfigs, (_, config) => ({
    provider: config.provider,
    confirmations: config.confirmations,
    overrides: config.overrides,
  }));
  const multiProvider = new MultiProvider(chainProviders);

  const contractsMap = buildContracts(
    deploymentAddresses,
    helloWorldFactories,
  ) as ChainMap<ChainName, HelloWorldContracts>;

  const core = HyperlaneCore.fromEnvironment('testnet2', multiProvider);
  const app = new HelloWorldApp(core, contractsMap, multiProvider);
  const config = core.extendWithConnectionClientConfig(
    getChainToOwnerMap(prodConfigs, ownerAddress),
  );

  console.info('Starting check');
  const helloWorldChecker = new HelloWorldChecker(multiProvider, app, config);
  await helloWorldChecker.check();
  helloWorldChecker.expectEmpty();
}

check()
  .then(() => console.info('Check complete'))
  .catch(console.error);
