import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { ipController } from './ip.controller'

new Elysia()
  .use(
    swagger({
      path: '/docs',
      scalarConfig: {
        customCss: await Bun.file('src/scalar.css').text(),
      },
      documentation: {
        info: {
          title: 'Utilities API',
          version: '1.0.0',
          description: '一些常用的Utils API。',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
          },
          contact: {
            email: 'zero@naily.cc',
            name: 'Zero',
            url: 'https://blog.naily.cc',
          },
        },
        servers: [
          { description: '服务器端', url: 'https://utils.xhhzs.cn' },
          { description: '本地开发', url: 'http://localhost:3040' },
        ],
        tags: [
          { name: 'IP', description: 'IP地址查询' },
        ],
      },
    }),
  )
  .use(ipController)
  .listen(3040, (server) => {
    console.log(`🦊 Elysia is running at ${server?.hostname}:${server?.port}`)
  })
