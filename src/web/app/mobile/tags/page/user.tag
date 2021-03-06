<mk-user-page>
	<mk-ui ref="ui">
		<mk-user ref="user" user={ parent.user } page={ parent.opts.page }/>
	</mk-ui>
	<style>
		:scope
			display block
	</style>
	<script>
		import ui from '../../scripts/ui-event';
		import Progress from '../../../common/scripts/loading';

		this.user = this.opts.user;

		this.on('mount', () => {
			Progress.start();

			this.refs.ui.refs.user.on('loaded', user => {
				Progress.done();
				document.title = user.name + ' | Misskey';
				// TODO: ユーザー名をエスケープ
				ui.trigger('title', '<i class="fa fa-user"></i>' + user.name);
			});
		});
	</script>
</mk-user-page>
