import * as commander from 'commander';

import { initConfig }           from './src/utils/config';
import { setupTransferCommand } from './src/commands/transfer.command';
import { logger }               from './src/utils/logger';
import { setupAirdropCommand } from './src/commands/airdrop.command';

const CLI_DESC = 'A CLI learning tool for testing Solana programs';
// Initialize Commander
const program = new commander.Command('solana-learn-cli');

async function init() {
  logger.info('Program starting...');
  await initConfig();

  // Define program description
  program.description(CLI_DESC);

  setupTransferCommand(program);
  setupAirdropCommand(program);

  // Parse command-line arguments
  program.parse(process.argv);

  // If no arguments are provided, display help
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

init().catch(logger.error);
