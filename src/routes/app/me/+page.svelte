<script lang="ts">
	import Crown from '$lib/components/icons/Crown.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col">
		<h1 class="text-lg font-bold">Settings</h1>
		<div class="flex flex-col">
			<div class="flex flex-row gap-1">
				<span class="font-bold">Name</span>
				<span>{data.user.displayName}</span>
			</div>
			<div class="flex flex-row gap-1">
				<span class="font-bold">Email</span>
				<span>{data.user.email}</span>
			</div>
		</div>
	</div>

	<div class="flex flex-col">
		<h1 class="text-lg font-bold">Your Lists</h1>
		<div class="flex flex-col gap-1">
			{#each data.lists as list}
				<a
					href={`/app/list/${list.id}`}
					class="flex flex-row items-center gap-2 px-3 py-2 rounded-lg bg-base-200 hover:bg-base-300"
				>
					<div class="flex flex-row items-center justify-between gap-2 grow">
						<span>{list.name}</span>
						<span class="text-sm text-gray-500">{list.description}</span>
					</div>
					{#if list.ownerId === data.user.id}
						<Crown class="text-blue-400 size-4" />
					{/if}
				</a>
			{/each}
		</div>
	</div>
</div>
