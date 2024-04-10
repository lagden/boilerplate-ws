import {stringToUint8Array, uint8ArrayToString} from 'uint8array-extras'

// prettier-ignore
const actions = new Set([
	'broadcast',
	'direct',
	'me',
])

function prepare(props) {
	// prettier-ignore
	const {
		action = 'direct',
		message = '',
		from,
		to,
	} = props

	return stringToUint8Array(
		JSON.stringify({
			action,
			message,
			from,
			to,
		}),
	)
}

export default function message(ws, message, isBinary) {
	try {
		const data = JSON.parse(uint8ArrayToString(new Uint8Array(message)))
		if (actions.has(data.action) === false) {
			throw new Error(`The action "${data?.action ?? 'unknown'}" not allowed`)
		}

		const ch = data.action === 'direct' ? `direct/${data.to}` : 'broadcast'
		const msg = prepare({
			action: data.action,
			message: data.message,
			from: ws._data.id,
			to: data.to,
		})

		if (data.action === 'me') {
			ws.send(msg, isBinary)
		} else {
			ws.publish(ch, msg, isBinary)
		}
	} catch (error) {
		ws.send(
			prepare({
				action: 'error',
				message: `ws | message | ${error.message}`,
				from: 'server',
				to: ws._data.id,
			}),
			isBinary,
		)
	}
}
