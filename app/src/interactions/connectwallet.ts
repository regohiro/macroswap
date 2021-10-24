import { getProvider, TSignerProvider } from "../connectors";
import {
  getNetworkData,
  networkId,
  web3Modal,
} from "../connectors/network-config";
import { initialState, IState } from "../state/user/reducers";

const addNetwork = async (id: number): Promise<void> => {
  const data = getNetworkData(id);

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: data?.chainId }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [data],
        });
      } catch (error: any) {
        alert("Failed to add network. Please switch to Rinkeby manually");
      }
    }
  }
};

export const connectWallet = async () => {
  //@ts-ignore
  let host = await web3Modal.connect();
  let provider = getProvider(host);
  let userNetId = (await provider.getNetwork()).chainId;

  if (host.isMetaMask && userNetId !== networkId) {
    await addNetwork(networkId);
    //@ts-ignore
    host = await web3Modal.connect();
    provider = getProvider(host);
    userNetId = (await provider.getNetwork()).chainId;
    if( userNetId !== networkId ){
      return initialState;
    }
  }

  const signer = provider.getSigner();
  const address = await signer.getAddress();

  return {
    host,
    provider,
    signer,
    address,
  };
};

export const disconnectWallet = async (
  host: any
): Promise<IState> => {
  try {
    await host.close();
  } catch (error) {}

  return initialState;
};

export const checkSigner = async (signerOrProvider: TSignerProvider) => {
  if (signerOrProvider.constructor.name === "JsonRpcSigner") {
    try {
      //@ts-ignore
      await signerOrProvider.getAddress();
    } catch (error) {
      throw new Error("Connect Wallet!");
    }
  }
};