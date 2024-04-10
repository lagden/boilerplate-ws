import '../cli/reset.js'

import {setTimeout} from 'node:timers/promises'
import {before, after, test} from 'node:test'
import assert from 'node:assert/strict'
import {pEvent, pEventMultiple} from 'p-event'
import {start, stop, websocket} from './__helper/server.js'
import {actions, assertResults, assert_a, assert_b} from './__helper/actions.js'

const TYPE_AUTHORIZATION = 'Bearer'
const KEY_QUERY = 'access_token'

const token_user_a = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiaWQiOiI2MjcxYmFiNWY2N2U5Y2NkNDkwMzNhYmIifQ.hmoUE_vayFKMKGz0v9iPLfIuneklDkL_qnD2n5QVKrYXmUwUqoJlSKGgafXIQGlyFxNZTucE8z8qdSRHZ-IXRQ'
const token_user_b = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsYmVydG8gUm9iZXJ0byIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImlkIjoiNjI3MWJhYjVmNjdlOWNjZDQ5MDMzYWJjIn0.CEoDPZn3IRrP4Cob6V_C41FxiqZoNkI6maN6c9tvfMrzw8gB5WWxBSiGdUWJ9HF4drPJANgEvfHKL8C0gNeuxA'

let token
let http
let ws

before(async () => {
	;({token, http, ws} = await start())
})

after(() => {
	stop(token)
})

test('nothing', async () => {
	const r = await globalThis.fetch(http)
	const d = await r.text()

	assert.equal(r.status, 200)
	assert.equal(d, 'Nothing to see here!')
})

test('message', async () => {
	const _base = `${ws}/?${KEY_QUERY}`

	const ws_a = websocket(`${_base}=${token_user_a}`)
	const ws_b = websocket(`${_base}=${token_user_b}`)

	const events = ['message', 'close']
	const opts = {
		resolveImmediately: true,
		count: Number.POSITIVE_INFINITY,
	}

	const promise_a = pEventMultiple(ws_a, events, opts)
	const promise_b = pEventMultiple(ws_b, events, opts)

	const result_a = await promise_a
	const result_b = await promise_b

	// Waiting for websocket
	await setTimeout(500)

	for (const action of actions) {
		ws_a.send(JSON.stringify(action))
	}

	ws_a.send('{action: json_invalid}')

	ws_a.close(1000)
	ws_b.close(1000)

	await setTimeout(500)

	assertResults(result_a, assert_a)
	assertResults(result_b, assert_b)
})

test('cookie', async () => {
	const ws_a = websocket(ws, {
		headers: {
			Cookie: `${KEY_QUERY}=${token_user_a}`,
		},
	})

	await pEvent(ws_a, 'open')

	ws_a.close(1000)
	const event = await pEvent(ws_a, 'close')
	const sym = Reflect.ownKeys(event).find(key => key.toString() === 'Symbol(kCode)')
	assert.ok(true)
	assert.equal(event[sym], 1000)
})

test('authorization', async () => {
	const ws_a = websocket(ws, {
		headers: {
			Authorization: `${TYPE_AUTHORIZATION} ${token_user_a}`,
		},
	})

	await pEvent(ws_a, 'open')

	ws_a.close(1000)
	const event = await pEvent(ws_a, 'close')
	const sym = Reflect.ownKeys(event).find(key => key.toString() === 'Symbol(kCode)')
	assert.ok(true)
	assert.equal(event[sym], 1000)
})

test('401', (_, done) => {
	const ws_a = websocket(ws)
	ws_a.on('unexpected-response', (req, res) => {
		assert.equal(res.statusCode, 401)
		res.on('end', done)
		req.destroy()
	})
})

test('abort', async () => {
	const ws_a = websocket(ws, {
		headers: {
			Authorization: `${TYPE_AUTHORIZATION} ${token_user_a}`,
			'x-slow': 'true',
		},
	})

	await setTimeout(500)
	ws_a.close()

	const error = await pEvent(ws_a, 'error')
	assert.equal(error.message, 'WebSocket was closed before the connection was established')
})
