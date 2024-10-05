// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test'
import { describe, it, expect } from 'vitest'
import worker from '../src/index'

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>

describe('ping handler', () => {
	it('responds with PONG (unit style)', async () => {
		const req = new IncomingRequest('http://localhost/ping')
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext()
		const resp = await worker.fetch(req, env, ctx)
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx)
		expect(await resp.text()).toContain('PONG')
	})
})

describe('404 handler', () => {
	it('responds with 404 status', async () => {
		const resp = await SELF.fetch('http://localhost/notexistpage')
		expect(resp.status).toBe(404)
	})
})
