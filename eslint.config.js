import globals from 'globals'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintPluginSonarjs from 'eslint-plugin-sonarjs'
import * as eslintrc from '@eslint/eslintrc'
import js from '@eslint/js'

export default [
	{
		...js.configs.recommended,
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			...eslintrc.Legacy.environments.get('es2024'),
		},
		plugins: {
			unicorn: eslintPluginUnicorn,
			sonarjs: eslintPluginSonarjs,
		},
		// prettier-ignore
		ignores: [
			// Dir
			'.conf',
			'.github',
			'.vite',
			'bin',
			'coverage',
			'dist',
			'logs',
			'node_modules',
			'resource',

			// File
			'*-lock.*',
			'*.lock',
			'*.log',
			'*.log*',
			'.registry-*',
			'_cleanup',
			'_init',
			'vite.config.js.timestamp-*',
		],
		rules: {
			camelcase: 'off',
			'capitalized-comments': 'off',
			indent: ['error', 'tab'],
			'linebreak-style': ['error', 'unix'],
			'no-console': 'off',
			'no-debugger': 'off',
			'no-undef-init': 'off',
			'no-unused-expressions': [
				'error',
				{
					allowShortCircuit: true,
					allowTernary: true,
					allowTaggedTemplates: true,
				},
			],
			'padding-line-between-statements': 'off',
			quotes: ['error', 'single'],
			semi: ['error', 'never'],
			'semi-spacing': [
				'error',
				{
					before: false,
					after: true,
				},
			],
			'spaced-comment': 'off',
			'unicorn/filename-case': 'off',
			'unicorn/no-array-reduce': 'off',
			'unicorn/no-useless-undefined': 'off',
			'unicorn/no-zero-fractions': 'off',
			'unicorn/prefer-includes': 'off',
			'unicorn/prefer-query-selector': 'off',
			'unicorn/prevent-abbreviations': 'off',
		},
	},
]
