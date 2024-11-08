<script lang="ts">
	import '../app.css';

	import Navbar from '$lib/componenets/Navbar.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<main class="flex flex-col max-w-3xl min-h-screen gap-2 p-2 mx-auto underline-offset-4">
	<Navbar user={data.user} />
	<div class="flex flex-col px-2 grow">
		{@render children()}
	</div>
</main>
