import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

/*
Define uma função assíncrona chamada usersRoutes que recebe uma instância
do FastifyInstance como argumento.
*/
export async function usersRoutes(app: FastifyInstance) {
  // Criando uma rota POST em '/' na instância do Fastify
  app.post('/', async (request, reply) => {
    const createrUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    // Obtendo o valor do cookie 'sessionId' da requisição HTTP
    let sessionId = request.cookies.sessionId

    // Verificando se o cookie 'sessionId' não existe
    if (!sessionId) {
      // Gerando um novo ID de sessão aleatório usando a função randomUUID()
      sessionId = randomUUID()

      // Definindo um novo cookie 'sessionId' na resposta HTTP com o valor gerado anteriormente
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days => Definindo o tempo máximo de vida do cookie em milissegundos (7 dias)
      })
    }

    // Extrai o name, email do corpo da requisição, validando com o esquema definido
    const { name, email } = createrUserBodySchema.parse(request.body)

    // Busca no banco de dados por um usuário com o mesmo email
    const userByEmail = await knex('users').where({ email }).first()

    // Se já existir um usuário com o mesmo email, retorna uma resposta com status 400 e uma mensagem de erro
    if (userByEmail) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    // Insere um novo usuário no banco de dados com um ID aleatório, nome, email e ID de sessão
    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
