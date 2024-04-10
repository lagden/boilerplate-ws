import process from 'node:process'
import {setTimeout} from 'node:timers/promises'
import {verify} from '@tadashi/jwt'

// prettier-ignore
const {
	KEY_COOKIE = 'access_token',
	KEY_QUERY = 'access_token',
	KEY_QUERY_FORCE = 'force',
	PROPS_AUTHORIZATION = 'authorization',
	PROPS_COOKIE = 'cookie',
	PROPS_QUERY = 'query',
	SECRET = 'exemplo',
	TYPE_AUTHORIZATION = 'Bearer',
} = process.env

/**
 * Extracts the token from the authorization header.
 *
 * @param {string} authorization - The authorization header.
 * @returns {string|undefined} The extracted token or undefined if not present.
 */
function getAuth(authorization) {
	const [type, token] = String(authorization).split(' ')
	if (type === TYPE_AUTHORIZATION && token) {
		return token
	}
}

/**
 * Gets authentication tokens from various sources.
 *
 * @param {Object} props - Authentication properties.
 * @returns {string[]} An array of authentication tokens.
 */
function getTokens(props) {
	const _authorization = getAuth(props?.[PROPS_AUTHORIZATION])
	const _cookie = props?.[PROPS_COOKIE]
	const _qs = props?.[PROPS_QUERY]
	/* c8 ignore start */
	const _tokens = [_cookie?.[KEY_COOKIE], _authorization, _qs?.[KEY_QUERY]]
	const tokens = new Set(_qs?.[KEY_QUERY_FORCE] ? [_qs?.[KEY_QUERY]] : _tokens)
	/* c8 ignore stop */
	return [...tokens]
}

/**
 * Verifies an authentication token.
 *
 * @param {string} token - The authentication token to verify.
 * @param {string} secret - The authentication secret.
 * @returns {Promise<{ response: Object, token: string }>} A promise resolving to the response and token.
 */
async function verifyToken(token, secret) {
	const response = await verify(token, {}, secret)
	return {
		response,
		token,
	}
}

/**
 * Authenticates the user based on the provided properties and secret.
 *
 * @param {Object} props - Authentication properties.
 * @param {string} [secret=SECRET] - The authentication secret.
 * @returns {Promise<Object>} A promise resolving to the authenticated user data.
 * @throws {Error} Throws an error if authentication fails (401 Unauthorized).
 */
export default async function auth(props, secret = SECRET) {
	// remove this - only for connection abort simulation on unit test
	if (props?.xslow) {
		await setTimeout(2000)
	}

	const tokens = getTokens(props)
	const promises = tokens.filter(Boolean).map(token => verifyToken(token, secret))

	try {
		const {
			// token,
			response: {payload},
		} = await Promise.any(promises)
		return payload
	} catch {
		throw new Error('401 Unauthorized')
	}
}
