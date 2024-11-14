<script lang="ts">
	import { enhance } from '$app/forms';
	import { env } from '$env/dynamic/public';
	import Back from '$lib/components/icons/Back.svelte';
	import Copy from '$lib/components/icons/Copy.svelte';
	import Crown from '$lib/components/icons/Crown.svelte';
	import Join from '$lib/components/icons/Join.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import Trash from '$lib/components/icons/Trash.svelte';
	import { notificationsStore } from '$lib/stores/notifications.svelte.js';
	import moment from 'moment';
	import { untrack } from 'svelte';

	let { data, form } = $props();
	let notifications = notificationsStore();

	let invites = $state(data.list.invites.sort((a, b) => moment(a.createdAt).diff(b.createdAt)));
	$effect(() => {
		if (form?.success) {
			if (form.action === 'create-invite') {
				untrack(() => {
					invites.push(form.invite);
					notifications.push({
						level: 'info',
						header: 'Invite created',
						message: 'You can manage this invite below',
						durationSec: 3
					});
				});
			}
		}
	});

	const copyInviteLink = (code: string) => {
		navigator.clipboard.writeText(`${env.PUBLIC_ORIGIN}/join/${code}`);
	};

	let categoryModalOpen = $state(false);
</script>

<div class="flex flex-col gap-4 grow">
	<div class="flex flex-row justify-between gap-4 items-top">
		<div class="flex flex-col overflow-hidden">
			<h1 class="text-xl">{data.list.name}</h1>
			{#if data.list.description}
				<span class="text-gray-500 break-words line-clamp-2">{data.list.description}</span>
			{/if}
		</div>
		<div class="flex gap-2">
			<a href={`/app/list/${data.list.id}`} class="btn btn-dark btn-square">
				<Back class="size-6" />
			</a>
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between gap-2">
			<h1 class="text-lg">Members</h1>
		</div>
		<div class="flex flex-col gap-2">
			{#each data.list.members as member}
				<div class="relative flex items-center justify-between gap-1 p-2 rounded-lg bg-base-200">
					<div class="flex items-center gap-1">
						{#if data.list.ownerId === member.id}
							<Crown class="absolute text-blue-400 -top-1.5 -right-1.5 size-4" />
						{/if}
						<img src={member.picture} class="w-5 h-5 rounded-full" alt={member.name} />
						<span>{member.name}</span>
					</div>
					<div class="flex items-center text-sm" aria-label="Joined At">
						<Join class="size-4" />
						{moment(member.joined).format('L')}
					</div>
				</div>
			{/each}
		</div>
	</div>
	{#if data.list.ownerId === data.user.id}
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between gap-2">
				<h1 class="text-lg">Active Invites</h1>
				<form action="?/create-invite" method="POST" use:enhance>
					<button
						class="p-1.5 transition-colors bg-blue-400 rounded-lg hover:bg-blue-500 text-white"
						type="submit"
					>
						<Plus class="size-4" />
					</button>
				</form>
			</div>
			{#if data.list.invites.length === 0}
				<span class="text-center text-gray-400">This list does not have any active invites</span>
			{:else}
				<div class="flex flex-col gap-1">
					{#each data.list.invites as invite}
						<div class="flex gap-1 grow">
							<div class="flex items-center justify-between rounded-lg grow bg-base-200">
								<div class="flex items-center h-full">
									<span
										class="flex items-center justify-center w-32 h-full px-3 rounded-lg bg-base-300"
									>
										{invite.code}
									</span>
									<button
										class="p-2 hover:text-blue-500"
										onclick={() => copyInviteLink(invite.code)}
									>
										<Copy class="size-5" />
									</button>
								</div>
								<div class="flex px-3 py-2">
									{moment(invite.createdAt).format('L')}
								</div>
							</div>

							<button
								class="flex items-center justify-center w-10 h-10 text-white bg-red-400 rounded-lg hover:bg-red-500"
							>
								<Trash class="size-5" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between gap-2">
			<h1 class="text-lg">Item Categories</h1>
			{#if data.list.ownerId === data.user.id}
				<button
					class="p-1.5 transition-colors bg-blue-400 rounded-lg hover:bg-blue-500 text-white"
					onclick={() => (categoryModalOpen = true)}
				>
					<Plus class="size-4" />
				</button>
			{/if}
		</div>
		{#if data.list.tags.length === 0}
			<span class="text-center text-gray-400">This list does not have any categories yet</span>
		{:else}
			<div class="flex gap-1">
				{#each data.list.tags as tag}
					<button class="btn btn-dark">{tag.name}</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<dialog open={categoryModalOpen} class="modal modal-top md:modal-middle">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Create a new category</h3>
		<p class="py-4">Press ESC key or click outside to close</p>
	</div>
	<form method="dialog" class="bg-black bg-opacity-50 modal-backdrop">
		<button onclick={() => (categoryModalOpen = false)}>close</button>
	</form>
</dialog>
