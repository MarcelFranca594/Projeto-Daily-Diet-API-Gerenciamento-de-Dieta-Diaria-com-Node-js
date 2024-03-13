import fastity from 'fastify'
import cookie from '@fastify/cookie'

//import { transactionsRoutes } from './routes/transactions'
// Criar a base da aplicação
export const app = fastity()
// 5 Principais métodos GET, POST, PUT,  PUTCH, DELETE
// http://localhost:3333/helo

app.register(cookie)
/*
app.register(transactionsRoutes, {
  prefix: 'transactions',
})
*/