import { Command } from 'commander';
import { PublicKey } from '@solana/web3.js';

import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { sendSol } from '../transfer';
import { getConfirmation } from '../solana-utils';
import { CLUSTER_NAME } from '../constants';

export const setupTransferCommand = (program: Command) => {
  program
    .command('transfer <amount> <toPubkey>')
    .description('Transfer SOL to a given address')
    .action(async (amount, publickey) => {
      if (!amount) {
        logger.warn(`Please provide an amount to send`);
        process.exit(1);
      }

      if (!publickey) {
        logger.warn(`Please provide a public key to send to`);
        process.exit(1);
      }
      logger.info(`🌌 Attempting to transfer ${amount} SOL to ${publickey}...`);

      const senderKeypair = config.get('keypair');
      logger.info(`🔐 senderKeypair: ${senderKeypair.publicKey.toBase58()}`);
      // logger.info(`✅ Loaded our own keypair, and connected to Solana`);

      logger.info(`📥 suppliedToPubkey: ${publickey}`);

      const toPubkey = new PublicKey(publickey);

      const signature = await sendSol(amount, senderKeypair, toPubkey);

      logger.info(`Transaction signature is ${signature}!`);
      const result = await getConfirmation(signature);
      if (!result) {
        process.exit(1);
      }
      const explorerUrl = `https://explorer.solana.com/tx/${result.signatures.pop()}?cluster=${CLUSTER_NAME}`;
      logger.info(`🔍 You can view your transaction at: ${explorerUrl}`);
    });
};
