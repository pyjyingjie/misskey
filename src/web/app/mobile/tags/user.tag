<mk-user>
	<div class="user" if={ !fetching }>
		<header>
			<div class="banner" style={ user.banner_url ? 'background-image: url(' + user.banner_url + '?thumbnail&size=1024)' : '' }></div>
			<div class="body">
				<div class="top">
					<a class="avatar">
						<img src={ user.avatar_url + '?thumbnail&size=200' } alt="avatar"/>
					</a>
					<mk-follow-button if={ SIGNIN && I.id != user.id } user={ user }/>
				</div>
				<div class="title">
					<h1>{ user.name }</h1>
					<span class="username">@{ user.username }</span>
					<span class="followed" if={ user.is_followed }>%i18n:mobile.tags.mk-user.is-followed%</span>
				</div>
				<div class="description">{ user.description }</div>
				<div class="info">
					<p class="location" if={ user.profile.location }>
						<i class="fa fa-map-marker"></i>{ user.profile.location }
					</p>
					<p class="birthday" if={ user.profile.birthday }>
						<i class="fa fa-birthday-cake"></i>{ user.profile.birthday.replace('-', '年').replace('-', '月') + '日' } ({ age(user.profile.birthday) }歳)
					</p>
				</div>
				<div class="status">
				  <a>
				    <b>{ user.posts_count }</b>
						<i>%i18n:mobile.tags.mk-user.posts-count%</i>
					</a>
					<a href="{ user.username }/following">
						<b>{ user.following_count }</b>
						<i>%i18n:mobile.tags.mk-user.following%</i>
					</a>
					<a href="{ user.username }/followers">
						<b>{ user.followers_count }</b>
						<i>%i18n:mobile.tags.mk-user.followers%</i>
					</a>
				</div>
				<mk-activity-table user={ user }/>
			</div>
			<nav>
				<a data-is-active={ page == 'posts' } onclick={ go.bind(null, 'posts') }>%i18n:mobile.tags.mk-user.posts%</a>
				<a data-is-active={ page == 'media' } onclick={ go.bind(null, 'media') }>%i18n:mobile.tags.mk-user.media%</a>
			</nav>
		</header>
		<div class="body">
			<mk-user-timeline if={ page == 'posts' } user={ user }/>
			<mk-user-timeline if={ page == 'media' } user={ user } with-media={ true }/>
		</div>
	</div>
	<style>
		:scope
			display block

			> .user
				> header
					> .banner
						padding-bottom 33.3%
						background-color #f5f5f5
						background-size cover
						background-position center

					> .body
						padding 12px
						margin 0 auto
						max-width 600px

						> .top
							&:after
								content ''
								display block
								clear both

							> .avatar
								display block
								float left
								width 25%
								height 40px

								> img
									display block
									position absolute
									left -2px
									bottom -2px
									width 100%
									border 2px solid #fff
									border-radius 6px

									@media (min-width 500px)
										left -4px
										bottom -4px
										border 4px solid #fff
										border-radius 12px

							> mk-follow-button
								float right
								height 40px

						> .title
							margin 8px 0

							> h1
								margin 0
								line-height 22px
								font-size 20px
								color #222

							> .username
								display inline-block
								line-height 20px
								font-size 16px
								font-weight bold
								color #657786

							> .followed
								margin-left 8px
								padding 2px 4px
								font-size 12px
								color #657786
								background #f8f8f8
								border-radius 4px

						> .description
							margin 8px 0
							color #333

						> .info
							margin 8px 0

							> p
								display inline
								margin 0 16px 0 0
								color #555

								> i
									margin-right 4px

						> .status
							> a
								color #657786

								&:first-child
									margin-right 16px

								> b
									margin-right 4px
									font-size 16px
									color #14171a

								> i
									font-size 14px

						> mk-activity-table
							margin 12px 0 0 0

					> nav
						display flex
						justify-content center
						margin 0 auto
						max-width 600px
						border-bottom solid 1px #ddd

						> a
							display block
							flex 1 1
							text-align center
							line-height 52px
							font-size 14px
							text-decoration none
							color #657786
							border-bottom solid 2px transparent

							&[data-is-active]
								font-weight bold
								color $theme-color
								border-color $theme-color

				> .body
					@media (min-width 500px)
						padding 16px 0 0 0

	</style>
	<script>
		this.age = require('s-age');

		this.mixin('i');
		this.mixin('api');

		this.username = this.opts.user;
		this.page = this.opts.page ? this.opts.page : 'posts';
		this.fetching = true;

		this.on('mount', () => {
			this.api('users/show', {
				username: this.username
			}).then(user => {
				this.fetching = false;
				this.user = user;
				this.trigger('loaded', user);
				this.update();
			});
		});

		this.go = page => {
			this.update({
				page: page
			});
		};
	</script>
</mk-user>
