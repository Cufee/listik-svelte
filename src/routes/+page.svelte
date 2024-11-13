<script lang="ts">
	let { data } = $props();
</script>

<div class="flex flex-col grow">
	<div class="hero grow">
		<div class="text-center hero-content">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">Welcome to Listik!</h1>
				<p class="py-6">
					This app is still in active development. We could add some AI slop placeholder text here,
					but we respect you enough not to do that.
				</p>
				{#if !!data.user}
					<a href="/app" class="btn btn-primary">Open App</a>
				{:else}
					<a href="/login" class="btn btn-primary">Get Started</a>
				{/if}
			</div>
		</div>
	</div>
</div>
