<script lang="ts">
	import type { List } from '$lib/server/db/types';

	let { list }: { list: List } = $props();
</script>

<a
	href={`/app/list/${list.id}`}
	class="flex flex-row items-center gap-2 p-4 transition-colors rounded-lg bg-base-200 hover:bg-base-300"
>
	<div class="flex flex-col items-start justify-between overflow-hidden">
		<span class="text-lg break-words grow">{list.name}</span>
		{#if list.description}
			<span class="w-full text-gray-500 break-words">
				{list.description}
			</span>
		{/if}
	</div>
</a>
