<script>
	import { env } from '$env/dynamic/public';
</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client" async></script>
</svelte:head>

<div>
	<div
		id="g_id_onload"
		data-client_id={env.PUBLIC_GOOGLE_CLIENT_ID}
		data-context="signin"
		data-ux_mode="popup"
		data-login_uri={env.PUBLIC_GOOGLE_REDIRECT_URL}
		data-auto_select="false"
		data-itp_support="true"
	></div>
	<div
		class="g_id_signin"
		data-type="standard"
		data-shape="pill"
		data-theme="outline"
		data-text="sign_in_with"
		data-size="medium"
		data-width="180"
		data-logo_alignment="center"
	></div>
</div>
