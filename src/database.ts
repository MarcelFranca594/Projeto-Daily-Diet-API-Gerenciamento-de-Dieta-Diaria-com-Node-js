import { knex as setupKnex } from 'knex'
// import { env } from './env'

export const knex = setupKnex({
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
})

/*
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? {
          filename: env.DATABASE_URL,
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
  export const knex = setupKnex(config)
*/
