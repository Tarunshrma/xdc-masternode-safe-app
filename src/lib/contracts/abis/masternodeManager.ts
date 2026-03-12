export const masternodeManagerAbi = [
  {
    inputs: [{ name: 'validator', type: 'address' }],
    name: 'getValidatorInfo',
    outputs: [
      { name: 'stake', type: 'uint256' },
      { name: 'signer', type: 'address' },
      { name: 'status', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
