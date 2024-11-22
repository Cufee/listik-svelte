<script lang="ts">
	import ListCard from '$lib/components/ListCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Listik - Home</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		{#each data.lists as list}
			<ListCard {list} />
		{/each}
	</div>

	<div class="flex items-center justify-center">
		<a href="/app/list/new" class="text-gray-400 underline">create a new list</a>
	</div>
</div>
