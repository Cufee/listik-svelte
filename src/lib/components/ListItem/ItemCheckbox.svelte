<script lang="ts">
	import type { ListItem } from '$lib/server/db/types';
	import Check from '../icons/Check.svelte';
	import Minus from '../icons/Minus.svelte';

	let { item }: { item: ListItem } = $props();
</script>

<div class="flex items-center justify-center w-5 h-5 border border-black rounded-md border-1">
	<div class:invisible={!item.checkedAt} class="group-hover:visible group-hover:text-gray-500">
		{#if !!item.checkedAt}
			<Check class="size-4 group-hover:hidden" />
			<Minus class="hidden size-4 group-hover:block" />
		{:else}
			<Check class="hidden size-4 group-hover:block" />
		{/if}
	</div>
</div>
