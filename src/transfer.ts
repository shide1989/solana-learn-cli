import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
}                     from '@solana/web3.js';
import { connection } from './utils/connection';
import { getBalance } from './solana-utils';
import { logger }     from './utils/logger';

export async function sendSol(
  amount: number,
  senderKeypair: Keypair,
  toPubkey: PublicKey,
) {
  const { sol, lamports } = await getBalance(senderKeypair.publicKey);
  if (lamports < 1.0) {
    logger.error(`Insufficient funds to send transaction`);
    process.exit(1);
  }

  const transaction = new Transaction();

  const lamportsToSend = amount * LAMPORTS_PER_SOL;

  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey,
    lamports: lamportsToSend,
  });

  transaction.add(sendSolInstruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
  ]);

  logger.info(
    `💸 Finished! Sent ${lamportsToSend} lamports (${lamportsToSend / LAMPORTS_PER_SOL} SOL) to the address ${toPubkey}. `,
  );
  await getBalance(senderKeypair.publicKey);
  await getBalance(toPubkey);
  return signature;
}
