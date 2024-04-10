import assert from 'node:assert/strict'

export function assertResults(results, asserts) {
	for (const event of results) {
		for (const sym of Object.getOwnPropertySymbols(event)) {
			if (['Symbol(kData)', 'Symbol(kCode)'].includes(sym.toString())) {
				const _data = JSON.parse(event[sym]) ?? {}
				assert.ok(asserts.includes(_data?.message ?? _data))
			}
		}
	}
}

export const actions = [
	{
		action: 'direct',
		message: 'Olá',
		to: '6271bab5f67e9ccd49033abc',
	},
	{
		action: 'me',
		message: 'Espelho, espelho meu!!',
	},
	{
		action: 'broadcast',
		message: 'Olá pessoal!',
	},
	{
		action: 'xxx',
	},
	{
		xxx: 'xxx',
	},
]

// prettier-ignore
export const assert_a = [
	'Espelho, espelho meu!!',
	'ws | message | The action "xxx" not allowed',
	'ws | message | The action "unknown" not allowed',
	'ws | message | Expected property name or \'}\' in JSON at position 1',
	1000,
]

// prettier-ignore
export const assert_b = [
	'Olá',
	'Olá pessoal!',
	1000,
]
