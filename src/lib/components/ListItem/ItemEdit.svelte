<script lang="ts">
	import type { ListItem } from '$lib/server/db/types';
	import Trash from '../icons/Trash.svelte';
	import ItemCheckbox from './ItemCheckbox.svelte';

	let {
		item,
		check,
		remove,
		class: classProp
	}: {
		item: ListItem;
		check: (id: string) => void;
		remove: (id: string) => void;
		class?: string;
	} = $props();
</script>

<div class="flex items-center gap-1">
	<button
		onclick={() => check(item.id)}
		class={'flex items-center gap-2 px-2 py-2 hover:bg-base-300 group grow ' + classProp}
	>
		<ItemCheckbox {item} />

		<div class="flex items-center gap-1">
			{#if (item.quantity ?? -1) > 0}
				<span class="text-blue-500">{item.quantity} x</span>
			{/if}
			<span>{item.name}</span>
		</div>
	</button>

	<button
		onclick={() => remove(item.id)}
		class="flex items-center justify-center w-10 h-10 text-white bg-red-400 rounded-lg hover:bg-red-500"
	>
		<Trash class="size-5" />
	</button>
</div>
