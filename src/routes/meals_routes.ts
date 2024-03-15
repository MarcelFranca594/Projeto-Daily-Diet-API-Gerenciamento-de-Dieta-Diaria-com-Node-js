import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  // Criando uma rota POST em '/' na instância do Fastify
  // Rota para criar uma refeição
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createrMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(), // Indica se a refeição está dentro da dieta
        date: z.date(), // Data e hora da refeição
      })

      const { name, description, isOnDiet, date } =
        createrMealsBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
        user_id: request.user?.id,
      })

      return reply.status(201).send()
    },
  )

  // Rota para listar todas as refeições de um usuário
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      // Busca no banco de dados todas as refeições do usuário atual, ordenadas por data decrescente
      const meals = await knex('meals')
        .where({ user_id: request.user?.id }) // Filtra as refeições pelo ID do usuário
        .orderBy('date', 'desc') // Ordena as refeições pela data em ordem decrescente

      return reply.send({ meals })
    },
  )
}
