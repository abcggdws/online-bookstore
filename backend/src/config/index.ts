import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface Config {
  port: number;
  jwtSecret: string;
  dataDir: string;
}

let config: Config | null = null;

export function getConfig(): Config {
  if (config) return config;

  const envPath = join(process.cwd(), '.env');
  const defaultConfig: Config = {
    port: 3000,
    jwtSecret: 'online-bookstore-secret-key',
    dataDir: join(process.cwd(), 'data')
  };

  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      const [key, value] = line.split('=').map(s => s.trim());
      if (key === 'PORT') defaultConfig.port = parseInt(value) || 3000;
      if (key === 'JWT_SECRET') defaultConfig.jwtSecret = value;
      if (key === 'DATA_DIR') defaultConfig.dataDir = value;
    }
  }

  config = defaultConfig;
  return config;
}