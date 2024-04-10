import * as debug from '@tadashi/debug'
import {uint8ArrayToString} from 'uint8array-extras'

export default function close(ws, code, message) {
	/* c8 ignore start */
	debug.info('ws | close', ws?._data?.name ?? 'Unknow', code, uint8ArrayToString(new Uint8Array(message)))
	/* c8 ignore stop */
}
