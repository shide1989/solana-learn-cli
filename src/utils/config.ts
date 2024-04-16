// @ts-ignore
import convict from 'convict';
import 'dotenv/config';
import { getKeypairFromFile } from '@solana-developers/helpers';
import { Keypair } from '@solana/web3.js';

const config = convict({
  app_name: {
    format: String,
    default: 'solana-app',
    env: 'APP_NAME',
  },
  rpc_endpoint: {
    format: String,
    default: 'https://api.devnet.solana.com',
    env: 'RPC_ENDPOINT',
  },
  rpc_requests_per_second: {
    format: Number,
    default: 0,
    env: 'RPC_REQUESTS_PER_SECOND',
  },
  rpc_max_batch_size: {
    format: Number,
    default: 20,
    env: 'RPC_MAX_BATCH_SIZE',
  },
  secret_key: {
    format: String,
    sensitive: true,
    default: '',
  },
  keypair_path: {
    format: String,
    default: '',
    env: 'KEYPAIR_PATH',
  },
  keypair: {
    default: null as Keypair | null,
  },
});

const initConfig = async () => {
  config.validate({ allowed: 'strict' });

  // Keypair validation
  const keypairPath = config.get('keypair_path');
  if (keypairPath) {
    const keypair = await getKeypairFromFile(keypairPath);
    config.set('keypair', keypair);
    return;
  }
  const secretKey = config.get('secret_key');
  if (secretKey) {
    const keypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(secretKey)),
    );
    config.set('keypair', keypair);
    return;
  }
  throw new Error('No keypair provided');
};

export { config, initConfig };
