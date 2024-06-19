import Elysia, { t } from 'elysia'
import { ip } from 'elysia-ip'
import axios, { AxiosError } from 'axios'

export const ipController = new Elysia({ prefix: '/ip', tags: ['IP'] })
  .use(ip())
  .get('', (ctx) => {
    return {
      code: 200,
      message: 'OK',
      data: {
        ip: ctx.ip || 'unknown',
      },
    }
  }, {
    detail: {
      summary: '获取IP',
      description: '直接获取IP。',
    },
    response: {
      200: t.Object({
        code: t.Literal(200),
        message: t.String({ default: 'OK', description: '状态信息' }),
        data: t.Object({
          ip: t.String({ default: 'unknown', description: 'IP地址' }),
        }),
      }),
    },
  })
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  .get('/info', async (ctx) => {
    try {
      const data = await axios.get(`https://opendata.baidu.com/api.php?query=${ctx.query.ip || ctx.ip}&resource_id=6006`)
      if (data.data.status !== '0') {
        return {
          code: 200,
          message: '未知',
          data: data.data,
        }
      }
      else {
        return {
          code: 200,
          message: data.data.data.location,
          data: data.data,
        }
      }
    }
    catch (error) {
      if (error instanceof AxiosError) {
        return {
          code: 200,
          message: '未知',
          data: error.response ? error.response.data : error,
        }
      }
      else {
        return {
          code: 500,
          message: '请求失败',
          data: error,
        }
      }
    }
  }, {
    detail: {
      summary: '使用百度API获取IP信息',
      description: '获取IP信息(通过百度API)。',
    },
    response: {
      200: t.Object({
        code: t.Union([t.Literal(200), t.Literal(500)]),
        message: t.String({ default: 'unknown', description: 'IP地址信息。有`未知`和`请求失败`的错误值' }),
        data: t.Record(t.String(), t.Any()),
      }),
    },
    query: t.Object({
      ip: t.Optional(t.String({ description: 'IP地址', default: '' })),
    }),
  })
