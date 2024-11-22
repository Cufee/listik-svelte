<script lang="ts">
	import '../app.css';

	import Navbar from '$lib/components/Navbar.svelte';
	import Notifications from '$lib/components/Notifications.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<title>Listik</title>
</svelte:head>

<main class="flex flex-col max-w-xl gap-2 p-2 mx-auto h-svh underline-offset-4">
	<Notifications />
	<Navbar user={data.user} />
	<div class="flex flex-col px-2 pb-2 grow">
		{@render children()}
	</div>
</main>
