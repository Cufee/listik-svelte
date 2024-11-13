<script lang="ts">
	import Crown from '$lib/components/icons/Crown.svelte';
	import Leave from '$lib/components/icons/Leave.svelte';
	import { notificationsStore } from '$lib/stores/notifications.svelte';
	import { untrack } from 'svelte';

	let { data, form } = $props();
	let lists = $state(data.lists);
	let notifications = notificationsStore();

	$effect(() => {
		if (form?.success) {
			if (form.action === 'leave-list') {
				untrack(() => {
					lists = lists.filter((l) => l.id !== form.list);
					notifications.push({
						level: 'info',
						header: 'You left a list',
						message: 'You will no longer have access to this list',
						durationSec: 3
					});
				});
			}
		}
		if (form?.success === false) {
			untrack(() => {
				lists = lists.filter((l) => l.id !== form.list);
				notifications.push({
					level: 'error',
					header: 'Error',
					message: form.message || 'An unknown error happened.',
					durationSec: 3
				});
			});
		}
	});
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
				<div class="flex flex-row gap-1">
					<a
						href={`/app/list/${list.id}`}
						class="flex flex-row items-center gap-2 px-3 py-2 rounded-lg bg-base-200 hover:bg-base-300 grow"
					>
						<div class="flex flex-row items-center justify-between gap-2 grow">
							<span>{list.name}</span>
							<span class="text-sm text-gray-500">{list.description}</span>
						</div>
						{#if list.ownerId === data.user.id}
							<Crown class="text-blue-400 size-4" />
						{/if}
					</a>
					{#if list.ownerId !== data.user.id}
						<form method="POST" action="?/leave-list">
							<input name="listId" value={list.id} hidden />
							<button
								type="submit"
								title={list.ownerId === data.user.id ? 'Delete List' : 'Leave List'}
								class="flex items-center justify-center w-10 h-10 p-2 text-white bg-red-400 rounded-lg cursor-pointer hover:bg-red-500"
							>
								<Leave class="size-5" />
							</button>
						</form>
					{:else}
						<!-- <Trash class="size-5" /> -->
						<!-- TODO: Option to delete a list, need to update schema cascading on delete -->
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
