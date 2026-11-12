import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { GoogleGenerativeAI } from '@google/generative-ai'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey =
    env.GEMINI_API_KEY ||
    env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'vite-dev-serverless-api-chat',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/chat' && req.method === 'POST') {
              let bodyStr = ''
              req.on('data', (chunk) => {
                bodyStr += chunk
              })
              req.on('end', async () => {
                try {
                  const body = JSON.parse(bodyStr || '{}')
                  const message = body.message
                  if (!message || typeof message !== 'string' || !message.trim()) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ message: 'Request body must include message' }))
                    return
                  }

                  const genAI = new GoogleGenerativeAI(apiKey)
                  const MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite']
                  let reply = ''
                  let lastErr = ''

                  for (const modelName of MODELS) {
                    try {
                      const model = genAI.getGenerativeModel({
                        model: modelName,
                        systemInstruction:
                          "You are 'Gramavance AI', an expert development assistant for rural micro-economies and Self-Help Groups (SHGs). Provide clear, step-by-step guidance on government grants, subsidy stacking, and financial readiness. Use Markdown, bullet points, and empathetic language.",
                      })
                      const result = await model.generateContent(message.trim())
                      reply = await result.response.text()
                      if (reply) break
                    } catch (e: any) {
                      lastErr = e?.message || ''
                    }
                  }

                  if (reply) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ text: reply.trim() }))
                  } else {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ message: 'Generation error', error: lastErr }))
                  }
                } catch (err: any) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ message: 'Internal Server Error', error: err?.message }))
                }
              })
            } else {
              next()
            }
          })
        },
      },
    ],
    server: {
      host: true,
      port: 5173,
    },
  }
})

