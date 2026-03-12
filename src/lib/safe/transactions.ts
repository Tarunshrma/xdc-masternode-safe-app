import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import type { TransactionPayload } from '../contracts/buildTransaction';

const safeAppsSdk = new SafeAppsSDK();

export const sendSafeTransaction = async (
  payload: TransactionPayload,
): Promise<void> => {
  await safeAppsSdk.txs.send({
    txs: [
      {
        to: payload.to,
        data: payload.data,
        value: payload.value.toString(),
      },
    ],
  });
};
