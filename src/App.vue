<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style>
	@font-face {
		font-family: 'SourceHanSansCN';
		src: url('./static/fonts/SourceHanSansCN-Regular.ttf') format('truetype');
	}

	body {
		font-family: 'SourceHanSansCN', sans-serif;
	}
</style>