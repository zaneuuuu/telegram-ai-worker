import { Context, Hono, MiddlewareHandler } from 'hono'

const basePath = '/ping'

export const app = new Hono().basePath(basePath)

const mh1: MiddlewareHandler = async (_c, n) => {
    console.log('begin ping 1st mh')
    await n()
    console.log('end ping 1st mh')
}
const mh2: MiddlewareHandler = async (_c, n) => {
    console.log('begin ping 2nd mh')
    await n()
    console.log('end ping 2nd mh')
}
const mhs: MiddlewareHandler[] = [mh1, mh2]

app.use(...mhs)
app.all(`/*`, async (c) => await handler(c))

async function handler(c: Context) {
    console.log('handle ping');
    return c.json({ success: true, msg: 'PONG' }, 200)
}
