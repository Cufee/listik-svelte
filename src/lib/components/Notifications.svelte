<script lang="ts">
	import { notificationsStore } from '$lib/stores/notifications.svelte';

	let notifications = notificationsStore();

	const toastClass = (level: string) => {
		switch (level) {
			case 'error':
				return 'bg-red-300 hover:bg-red-400';
			case 'warn':
				return 'bg-yellow-300 hover:bg-yellow-400';
			case 'info':
				return 'bg-blue-300 hover:bg-blue-400';
			case 'success':
				return 'bg-green-300 hover:bg-green-400';
			default:
				return 'bg-base-300 hover:bg-base-300';
		}
	};
	const headerClass = (level: string) => {
		switch (level) {
			case 'error':
				return 'text-red-700';
			case 'warn':
				return 'text-yellow-700';
			case 'info':
				return 'text-blue-700';
			case 'success':
				return 'text-green-700';
			default:
				return 'text-gray-600';
		}
	};
</script>

<div
	class="absolute left-0 flex flex-col items-center w-full gap-1 cursor-pointer pointer-events-none top-1"
>
	{#each notifications.all as notification}
		<button
			onclick={() => notifications.dismiss(notification.id)}
			class={'min-w-48 flex flex-col items-start max-w-2xl px-4 py-2 rounded-lg shadow-lg bg-opacity-80 hover:bg-opacity-100 pointer-events-auto ' +
				toastClass(notification.level)}
		>
			<span class={'text-lg font-bold ' + headerClass(notification.level)}>
				{notification.header}
			</span>
			<span>{notification.message}</span>
		</button>
	{/each}
</div>
