<script lang="ts">
	import '../app.css';

	import Navbar from '$lib/componenets/Navbar.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<main class="mx-auto min-h-screen max-w-7xl p-2 flex flex-col gap-2 underline-offset-4">
	<Navbar user={data.user} />
	<div class="flex flex-col px-2">
		{@render children()}
	</div>
</main>
