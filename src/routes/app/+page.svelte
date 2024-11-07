<script lang="ts">
	import ListCard from '$lib/componenets/ListCard.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		{#each data.lists as list}
			<ListCard {list} />
		{/each}
	</div>

	<div class="flex items-center justify-center">
		<button class="text-primary underline">create a new list</button>
	</div>
</div>
