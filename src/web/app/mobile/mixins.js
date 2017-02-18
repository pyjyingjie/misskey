const riot = require('riot');

module.exports = me => {
	if (me) {
		require('./scripts/stream')(me);
	}

	require('./scripts/ui');

	riot.mixin('open-post-form', {
		openPostForm: opts => {
			const app = document.getElementById('app');
			app.style.display = 'none';

			function recover() {
				app.style.display = 'block';
			}

			const form = riot.mount(document.body.appendChild(document.createElement('mk-post-form')), opts)[0];
			form
				.on('cancel', recover)
				.on('post', recover);
		}
	});
};