const path = require('path');
const fs = require('fs');

let dotenv;
try {
  dotenv = require('dotenv');
} catch {
  // Lightweight native fallback parser if dotenv is not yet installed in host node_modules
  dotenv = {
    config: ({ path: envFile } = {}) => {
      if (!envFile || !fs.existsSync(envFile)) return;
      const content = fs.readFileSync(envFile, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined) {
          process.env[key] = val;
        }
      }
    },
  };
}

// Search order for .env files:
// 1. Current working directory .env
// 2. Parent directory ../.env (when run from backend/)
// 3. Project root ../../.env (when run from backend/src/)
// 4. Local backend/.env (legacy fallback)
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../backend/.env'),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

// Fallback to default dotenv behavior if module exists
if (typeof dotenv.config === 'function') {
  dotenv.config();
}

module.exports = process.env;
