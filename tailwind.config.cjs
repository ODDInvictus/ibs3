const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
			invert: {
				50: '.5'
			}
		}
	},

	plugins: [
		require('flowbite/plugin'),
		({ addBase }) => {
			addBase({
				'a': { color: 'var(--link-color)' }
			});
		},
	],
	darkMode: 'class'
};

module.exports = config;
