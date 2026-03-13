import { isAddress, parseEther, type Address } from 'viem';

export const validateAddress = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      isValid: false,
      address: null,
      error: 'Address is required.',
    };
  }

  if (!isAddress(trimmed)) {
    return {
      isValid: false,
      address: null,
      error: 'Invalid address format.',
    };
  }

  return {
    isValid: true,
    address: trimmed as Address,
    error: null,
  };
};

export const validateAmount = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      isValid: false,
      value: null,
      error: 'Amount is required.',
    };
  }

  const parsedNumber = Number(trimmed);

  if (Number.isNaN(parsedNumber) || parsedNumber < 0) {
    return {
      isValid: false,
      value: null,
      error: 'Amount must be a positive number.',
    };
  }

  try {
    return {
      isValid: true,
      value: parseEther(trimmed),
      error: null,
    };
  } catch (err) {
    return {
      isValid: false,
      value: null,
      error: 'Amount is not a valid number.',
    };
  }
};

export const validateUint = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      isValid: false,
      value: null,
      error: 'Value is required.',
    };
  }

  if (!/^\d+$/.test(trimmed)) {
    return {
      isValid: false,
      value: null,
      error: 'Value must be a whole number.',
    };
  }

  try {
    return {
      isValid: true,
      value: BigInt(trimmed),
      error: null,
    };
  } catch (err) {
    return {
      isValid: false,
      value: null,
      error: 'Value is not a valid integer.',
    };
  }
};
