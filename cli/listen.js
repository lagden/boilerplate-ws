import process from 'node:process'
import la from '@tadashi/local-access'
import * as debug from '@tadashi/debug'
import app from '../server/app.js'

// prettier-ignore
const {
	PORT: port = 5001,
	HOSTNAME_CUSTOM: hostname = '127.0.0.1',
	VERSION = 'dev',
} = process.env

// prettier-ignore
const {
	local,
	network,
} = la({port, hostname})

// prettier-ignore
const {
	local: local_ws,
	network: network_ws,
} = la({port, hostname, protocol: 'ws'})

app.listen('::', Number(port), token => {
	if (token) {
		debug.info('Server listening')
		debug.info('----------------')
		debug.info(`Local:    ${local}`)
		debug.info(`Network:  ${network}`)
		debug.info('----------------')
		debug.info(`Local:    ${local_ws}`)
		debug.info(`Network:  ${network_ws}`)
		debug.info('----------------')
		debug.info(`Version:  ${VERSION}`)
	} else {
		debug.error('Failed to listen to port!')
		debug.error(`Local:    ${port}`)
	}
})
