import * as debug from '@tadashi/debug'

export default function open(ws) {
	ws.subscribe('broadcast')
	ws.subscribe(`direct/${ws._data.id}`)

	debug.info('open ws', ws._data)
}
