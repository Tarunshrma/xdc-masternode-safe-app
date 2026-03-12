const XDC_CHAIN_ID = 50;

export const isSupportedChain = (chainId: string | number | null) => {
  if (chainId === null) {
    return false;
  }

  return Number(chainId) === XDC_CHAIN_ID;
};

export const assertXdcChain = (chainId: string | number | null) => {
  if (!isSupportedChain(chainId)) {
    throw new Error('Unsupported network. Please switch to XDC (chainId 50).');
  }
};

export { XDC_CHAIN_ID };
