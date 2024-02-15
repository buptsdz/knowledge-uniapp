<script>
	export default {
		globalData: {
			isLoggedIn: false,
		},
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style>
	::-webkit-scrollbar {
		display: none;
		/* 隐藏滚动条但保留滚动功能 */
	}

	/* 字体 */
	@font-face {
		font-family: 'SourceHanSansCN';
		src: url('./static/fonts/SourceHanSansCN-Regular.ttf') format('truetype');
	}

	body {
		font-family: 'SourceHanSansCN', sans-serif;
	}
	uni-modal {
	  z-index: 99999 !important;
	}
</style>