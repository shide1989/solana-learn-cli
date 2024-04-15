import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';

import { connection } from './utils/connection';
import { logger }     from './utils/logger';

export const getBalance = async (publicKey: PublicKey) => {
  const balanceInLamports = await connection.getBalance(publicKey);

  const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
  logger.info(
    `💰The balance for wallet ${publicKey} is ${balanceInSOL} SOL !`,
  );
  return { sol: balanceInSOL, lamports: balanceInLamports };
};

export const generateKeypair = async () => {
  const keypair = getKeypairFromEnvironment('SECRET_KEY');

  console.log(
    `✅ Finished! We've loaded our secret key securely, using an env file!`,
  );
  console.log(`The public key is: `, keypair.publicKey.toBase58());
  console.log(`The secret key is: `, keypair.secretKey);
  console.log(`✅ Finished!`);

  return { keypair };
};

export async function getConfirmation(signature: string) {
  const status = await connection.getTransaction(signature, {
    maxSupportedTransactionVersion: 2,
  });
  if (!status) {
    logger.error(`Transaction not confirmed: ${signature}`);
    return null;
  }
  // logger.info(`Transaction ${JSON.stringify(status.transaction)}`);
  return status.transaction;
}
