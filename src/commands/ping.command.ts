import { Command } from 'commander';
import {
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

import { logger } from '../utils/logger';
import { config } from '../utils/config';
import { connection } from '../utils/connection';
import {
  CLUSTER_NAME,
  PING_PROGRAM_ADDRESS,
  PING_PROGRAM_DATA_ADDRESS,
} from '../constants';

export const setupPingCommand = (program: Command) => {
  program
    .command('ping')
    .description('Writing transactions for the ping counter program')
    .action(async () => {
      logger.info('Executing ping command');
      const senderKeypair = config.get('keypair');
      logger.info(`🔐 senderKeypair: ${senderKeypair.publicKey.toBase58()}`);

      const transaction = new Transaction();
      const programId = new PublicKey(PING_PROGRAM_ADDRESS);
      const pingProgramDataId = new PublicKey(PING_PROGRAM_DATA_ADDRESS);

      const instruction = new TransactionInstruction({
        keys: [
          {
            pubkey: pingProgramDataId,
            isSigner: false,
            isWritable: true,
          },
        ],
        programId,
      });

      transaction.add(instruction);

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair],
      );

      logger.info(`✅ Transaction completed! Signature is ${signature}`);
      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=${CLUSTER_NAME}`;
      logger.info(`🔍 You can view your transaction at: ${explorerUrl}`);
    });
};
