// import { app } from './app'
import fastity from 'fastify'
import { knex } from './database'

const app = fastity()

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*')

  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
