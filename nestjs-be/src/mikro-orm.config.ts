import { Options, defineConfig } from '@mikro-orm/postgresql';

const options: Options = {
  dbName: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  seeder: {
    path: 'dist/seeders',
    pathTs: 'src/seeders',
    defaultSeeder: 'InvitationSeeder',
  },
  migrations: {
    disableForeignKeys: false,
    snapshot: false,
    fileName: (timestamp: string, name?: string) => {
      if (!name) throw new Error('Specify migration name via `mikro-orm migration:create --name=...`');

      return `Migration_${timestamp}_${name}`;
    },
  },
  discovery: {
    warnWhenNoEntities: false,
  },
  debug: process.env.POSTGRES_SHOW_DEBUG.toLowerCase() === 'true',
};

export default defineConfig(options);
