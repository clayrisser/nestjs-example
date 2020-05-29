import dotenv from 'dotenv';

process.stdout.write('export');
Object.keys(dotenv.config().parsed).forEach((key: string) =>
  process.stdout.write(` ${key}="${process.env[key].replace(/"/g, '\\"')}"`)
);
