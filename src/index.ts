import { Hono } from 'hono'
import { app as pingApp } from './handler/ping_handler'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { trimTrailingSlash } from 'hono/trailing-slash'

// define sub apps
const subApps: Hono[] = [pingApp,]

type Bindings = {
    [key in keyof Env]: Env[key]
}
const app = new Hono<{ Bindings: Bindings }>({ strict: true })

// apply common middlewares
app.use(logger())
app.use(trimTrailingSlash()) // trim /path/ to /path

// init service
var initFlag = false
app.use(async (_c, n) => {
    if (!initFlag) {
        console.log('starting service init...')
        initFlag = true
        console.log('service init complete.')
    }
    await n()
})

// handle errors
app.notFound((c) => c.json({ success: false, msg: 'Not Found!' }, 404))
app.onError((err, c) => {
    console.error('[ErrorHandler]resp with err: ', err, err.stack)
    if (err instanceof HTTPException) {
        let resp = err.getResponse()
        if (!resp) {
            resp = c.json({ success: false, msg: err.message }, err.status)
        }
        return resp
    }
    return c.json({ success: false, msg: err.message }, 400)
})

// route sub apps
subApps.forEach(subApp => app.route('/', subApp))

export default {
    fetch: app.fetch,
}
