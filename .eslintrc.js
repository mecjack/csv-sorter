// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
	rules: {
		'eqeqeq': 'error',
		'no-console': 'error',
		'no-debugger': 'error',
		'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
		'sort-imports': 'error',
		'sort-keys': 'error',
		'sort-vars': 'error',
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
  };