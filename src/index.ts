import { Hono } from 'hono'
import { runWithTools } from '@cloudflare/ai-utils'

const getWeather = async (args: { latitude: string; longitude: string }) => {
  console.log(args)
  return '晴れ'
}

type Bindings = {
  AI: Ai
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const result = await runWithTools(c.env.AI, '@hf/nousresearch/hermes-2-pro-mistral-7b', {
    messages: [{ role: 'user', content: 'What is the weather in Yokohama?' }],
    tools: [
      {
        name: 'getWeather',
        description: 'Return the weather for a latitude and longitude',
        parameters: {
          type: 'object',
          properties: {
            latitude: {
              type: 'string',
              description: 'The latitude for the given location'
            },
            longitude: {
              type: 'string',
              description: 'The longitude for the given location'
            }
          },
          required: ['latitude', 'longitude']
        },
        function: getWeather
      }
    ]
  })
  return c.json(result)
})

export default app
