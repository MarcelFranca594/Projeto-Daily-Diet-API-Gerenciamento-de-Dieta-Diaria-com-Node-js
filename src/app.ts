import fastity from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users_routes'
import { mealsRoutes } from './routes/meals_routes'

export const app = fastity()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})
app.register(mealsRoutes, {
  prefix: 'meals',
})
