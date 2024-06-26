import Elysia, { t } from 'elysia'
import { ip } from 'elysia-ip'
import type { AxiosResponse } from 'axios'
import axios, { AxiosError } from 'axios'
import { cors } from '@elysiajs/cors'

export const ipController = new Elysia({ prefix: '/ip', tags: ['IP'] })
  .use(cors())
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
  .get('/info', async (ctx) => {
    let data: AxiosResponse
    try {
      data = await axios.get(`https://qifu-api.baidubce.com/ip/geo/v1/district?ip=${ctx.query.ip || ctx.ip}&timestamp=${new Date().getTime()}`)
    }
    catch (error) {
      if (error instanceof AxiosError) {
        data = error.response!
      }
      else {
        return {
          code: 500,
          message: '请求错误',
          data: {},
        }
      }
    }

    if (data.data.code === 'MissingParameter') {
      return {
        code: 400,
        message: '参数缺失，获取不到当前IP信息',
        data: data.data,
      }
    }
    else if (data.data.code === 'Success') {
      return {
        code: 200,
        message: 'OK',
        data: data.data.data,
      }
    }
    else {
      return {
        code: 400,
        message: '参数错误',
        data: data.data,
      }
    }
  }, {
    detail: {
      summary: '使用百度API获取IP信息',
      description: '获取IP信息(通过百度API)。',
    },
    response: {
      200: t.Object({
        code: t.Union([t.Literal(200, { description: '成功' }), t.Literal(500, { description: '请求错误' }), t.Literal(400, { description: '参数错误' })]),
        message: t.String({ default: 'unknown', description: '状态信息。' }),
        data: t.Record(t.String(), t.Any()),
      }),
    },
    query: t.Object({
      ip: t.Optional(t.String({ description: 'IP地址', default: '' })),
    }),
  })
