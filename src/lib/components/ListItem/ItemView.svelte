<script lang="ts">
	import type { ListItem } from '$lib/server/db/types';
	import ItemCheckbox from './ItemCheckbox.svelte';

	let { item, check }: { item: ListItem; check: (id: string) => void } = $props();
</script>

<button
	onclick={() => check(item.id)}
	class="flex items-center gap-2 px-2 py-2 rounded-lg bg-base-200 hover:bg-base-300 group"
>
	<ItemCheckbox {item} />

	<div class="flex items-center gap-1">
		{#if (item.quantity ?? -1) > 0}
			<span class="text-blue-500">{item.quantity} x</span>
		{/if}
		<span>{item.name}</span>
	</div>
</button>
