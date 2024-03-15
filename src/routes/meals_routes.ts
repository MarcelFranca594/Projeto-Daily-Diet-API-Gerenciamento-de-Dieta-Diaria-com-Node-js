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

  // Rota para visualizar os detalhes de uma única refeição com base no ID da refeição
  app.get(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      // Define um esquema de validação para os parâmetros da URL
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(request.params)

      // Busca no banco de dados a refeição com o ID fornecido
      const meal = await knex('meals').where({ id: mealId }).first()

      // Se não encontrar a refeição, retorna uma resposta com status 404 (Not Found)
      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      // Retorna uma resposta com os dados da refeição encontrada
      return reply.send({ meal })
    },
  )

  // Rota para atualizar os detalhes de uma refeição com base no ID da refeição
  app.put(
    '/:mealId',
    { preHandler: [checkSessionIdExists] }, // Middleware para verificar se o ID da sessão existe
    async (request, reply) => {
      // Define um esquema de validação para os parâmetros da URL
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      // Extrai o ID da refeição dos parâmetros da URL e valida-o
      const { mealId } = paramsSchema.parse(request.params)

      // Define um esquema de validação para os dados da refeição a serem atualizados
      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(), // Converte o valor para o tipo 'Date'
      })

      // Extrai os dados da refeição do corpo da requisição e valida-os
      const { name, description, isOnDiet, date } = updateMealBodySchema.parse(
        request.body,
      )

      // Busca no banco de dados a refeição com o ID fornecido
      const meal = await knex('meals').where({ id: mealId }).first()

      // Se não encontrar a refeição, retorna uma resposta com status 404 (Not Found)
      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      // Atualiza os detalhes da refeição no banco de dados
      await knex('meals').where({ id: mealId }).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(), // Converte o valor da data para milissegundos
      })

      // Retorna uma resposta com status 204 (No Content) indicando que a atualização foi bem-sucedida
      return reply.status(204).send()
    },
  )
}
