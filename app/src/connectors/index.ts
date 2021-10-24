import { defaultRPCURL } from './network-config';
import { JsonRpcProvider, JsonRpcSigner, Web3Provider } from "@ethersproject/providers"

export type TProvider = Web3Provider | JsonRpcProvider;
export type TSignerProvider = JsonRpcSigner | TProvider;

export const getProvider = (host: any): Web3Provider => {
  const provider = new Web3Provider(host);
  provider.pollingInterval = 15000;
  return provider;
}

export const getDefaultProvider = (): JsonRpcProvider => {
  const provider = new JsonRpcProvider(defaultRPCURL);
  return provider
}