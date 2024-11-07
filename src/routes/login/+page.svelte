<script>
	import { env } from '$env/dynamic/public';
</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client" async></script>
</svelte:head>
<div
	id="g_id_onload"
	data-client_id={env.PUBLIC_GOOGLE_CLIENT_ID}
	data-context="signin"
	data-ux_mode="popup"
	data-login_uri={env.PUBLIC_GOOGLE_REDIRECT_URL}
	data-nonce=""
	data-auto_select="true"
	data-itp_support="true"
></div>
<div
	class="g_id_signin"
	data-type="standard"
	data-shape="pill"
	data-theme="outline"
	data-text="continue_with"
	data-size="large"
	data-logo_alignment="center"
></div>
