/**
 * Replace i18n texts
 */

const StringReplacePlugin = require('string-replace-webpack-plugin');

export default (lang, locale) => ({
	enforce: 'pre',
	test: /\.(tag|js)$/,
	exclude: /node_modules/,
	loader: StringReplacePlugin.replace({
		replacements: [
			{
				pattern: /%i18n:(.+?)%/g, replacement: (_, key) => {
					let text = locale;
					
					// Check the key existance
					const error = key.split('.').some(k => {
						if (text.hasOwnProperty(k)) {
							text = text[k];
							return false;
						} else {
							return true;
						}
					});
					
					if (error) {
						console.warn(`key '${key}' not found in '${lang}'`);
						return key; // Fallback
					} else {
						return text.replace(/'/g, '\\\'').replace(/"/g, '\\"');
					}
				}
			}
		]
	})
});
