<script lang="ts">
	import type { List } from '$lib/server/db/types';

	let { list }: { list: List } = $props();
</script>

<a
	href={`/app/list/${list.id}`}
	class="flex flex-row items-center gap-2 p-4 transition-colors rounded-lg bg-base-200 hover:bg-base-300"
>
	<div class="flex flex-row items-start justify-between gap-2 overflow-hidden grow">
		<span class="text-lg break-words grow basis-1/3">{list.name}</span>
		{#if list.description}
			<span class="text-gray-500 break-words basis-2/3 text-end line-clamp-2">
				{list.description}
			</span>
		{/if}
	</div>
</a>
