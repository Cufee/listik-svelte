<script lang="ts">
	import '../app.css';

	import Navbar from '$lib/components/Navbar.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<main class="flex flex-col h-full max-w-3xl gap-2 p-2 mx-auto underline-offset-4">
	<Navbar user={data.user} />
	<div class="flex flex-col px-2 grow">
		{@render children()}
	</div>
</main>
