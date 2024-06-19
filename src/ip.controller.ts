import Elysia from 'elysia'
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
      summary: '获取IP信息',
      description: '获取IP信息。',
    },
  })
  .get('/info', async (ctx) => {
    try {
      const data = await axios.get(`https://opendata.baidu.com/api.php?query=${ctx.ip}&resource_id=6006`)
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
          code: 500,
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
  })
