<script lang="ts">
	import { env } from '$env/dynamic/public';
</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client"></script>
</svelte:head>
<div class="flex flex-col justify-center items-center gap-4">
	<h1 class="text-xl">Welcome to Listik!</h1>
	<div>
		<div
			id="g_id_onload"
			data-client_id={env.PUBLIC_GOOGLE_CLIENT_ID}
			data-context="signin"
			data-ux_mode="popup"
			data-login_uri={env.PUBLIC_GOOGLE_REDIRECT_URL}
			data-auto_select="true"
			data-itp_support="true"
		></div>
		<div
			class="g_id_signin w-full"
			data-type="standard"
			data-shape="pill"
			data-theme="outline"
			data-text="sign_in_with"
			data-size="large"
			data-logo_alignment="center"
		>
			<div class="text-center">
				<p>Your browser does not support Google Sign-in.</p>
				<p>Please use a different browser or device.</p>
			</div>
		</div>
	</div>
</div>
