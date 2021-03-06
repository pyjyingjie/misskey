<mk-home>
	<div class="main">
		<div class="left" ref="left"></div>
		<main>
			<mk-timeline-home-widget ref="tl" if={ mode == 'timeline' }/>
			<mk-mentions-home-widget ref="tl" if={ mode == 'mentions' }/>
		</main>
		<div class="right" ref="right"></div>
	</div>
	<style>
		:scope
			display block

			> .main
				margin 0 auto
				max-width 1200px

				&:after
					content ""
					display block
					clear both

				> *
					float left

					> *
						display block
						//border solid 1px #eaeaea
						border solid 1px rgba(0, 0, 0, 0.075)
						border-radius 6px
						//box-shadow 0px 2px 16px rgba(0, 0, 0, 0.2)

						&:not(:last-child)
							margin-bottom 16px

				> main
					padding 16px
					width calc(100% - 275px * 2)

				> *:not(main)
					width 275px

				> .left
					padding 16px 0 16px 16px

				> .right
					padding 16px 16px 16px 0

				@media (max-width 1100px)
					> *:not(main)
						display none

					> main
						float none
						width 100%
						max-width 700px
						margin 0 auto

	</style>
	<script>
		this.mixin('i');

		this.mode = this.opts.mode || 'timeline';

		const _home = {
			left: [
				'profile',
				'calendar',
				'activity',
				'rss-reader',
				'trends',
				'photo-stream',
				'version'
			],
			right: [
				'broadcast',
				'notifications',
				'user-recommendation',
				'recommended-polls',
				'server',
				'donation',
				'nav',
				'tips'
			]
		};

		this.home = [];

		this.on('mount', () => {
			this.refs.tl.on('loaded', () => {
				this.trigger('loaded');
			});
/*
			this.I.data.home.forEach(widget => {
				try {
					const el = document.createElement(`mk-${widget.name}-home-widget`);
					switch (widget.place) {
						case 'left': this.refs.left.appendChild(el); break;
						case 'right': this.refs.right.appendChild(el); break;
					}
					this.home.push(riot.mount(el, {
						id: widget.id,
						data: widget.data
					})[0]);
				} catch (e) {
					// noop
				}
			});
*/
			_home.left.forEach(widget => {
				const el = document.createElement(`mk-${widget}-home-widget`);
				this.refs.left.appendChild(el);
				this.home.push(riot.mount(el)[0]);
			});

			_home.right.forEach(widget => {
				const el = document.createElement(`mk-${widget}-home-widget`);
				this.refs.right.appendChild(el);
				this.home.push(riot.mount(el)[0]);
			});
		});

		this.on('unmount', () => {
			this.home.forEach(widget => {
				widget.unmount();
			});
		});
	</script>
</mk-home>
