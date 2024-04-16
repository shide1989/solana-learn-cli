import { Command } from 'commander';
import { connection } from '../utils/connection';
import { airdropIfRequired } from '@solana-developers/helpers';
import { config } from '../utils/config';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { logger } from '../utils/logger';
import { getBalance } from '../solana-utils';

const MIN_ACCOUNT_BALANCE = 1.0;

export const setupAirdropCommand = (program: Command) => {
  program
    .command('airdrop <amount>')
    .description('Request an airdrop of SOL to the specified address')
    .action(async (amount = 1) => {
      if (amount > 1000) {
        console.log(
          `Airdrop amount must be not be abusive, please try again with a smaller amount.`,
        );
        process.exit(1);
      }
      const payerKeypair = config.get('keypair');
      await getBalance(payerKeypair.publicKey);
      console.log(`Requesting a SOL airdrop of ${amount}...`);
      const newBalance = await airdropIfRequired(
        connection,
        payerKeypair.publicKey,
        amount * LAMPORTS_PER_SOL,
        MIN_ACCOUNT_BALANCE * LAMPORTS_PER_SOL,
      );
      logger.info(
        `✅ Airdrop successful! New balance is: ${newBalance / LAMPORTS_PER_SOL}`,
      );
    });
};
