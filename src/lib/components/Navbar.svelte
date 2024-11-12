<script lang="ts">
	import { navigating, page } from '$app/stores';
	import type { User } from '$lib/server/db/types';
	import { untrack } from 'svelte';
	import GoogleSignin from './GoogleSignin.svelte';
	import Logo from './Logo.svelte';

	let { user }: { user: User | null } = $props();

	let progress = $state(0);
	let loading = $state(false);
	$effect(() => {
		if ($navigating?.complete) {
			untrack(async () => {
				loading = true;

				const loadingTimer = setInterval(() => {
					if (progress > 90) return;
					const phase = progress / 90;
					const increment = 5 * (1 - phase * 0.8);
					progress += Math.max(0.5, increment);
				}, 200);

				await $navigating.complete;
				loading = false;
				clearInterval(loadingTimer);
				progress = 0;
			});
		}
	});
</script>

<div class="fixed top-0 w-full max-w-3xl overflow-hidden h-fit rounded-b-box">
	<div
		class:invisible={!loading}
		style={`width: ${progress}%`}
		class="h-1 transition-[width] duration-200 ease-in rounded-r-full bg-green-400"
	></div>
</div>

<div class="p-0 navbar bg-base-100">
	<div class="flex-1">
		<a href={!!user ? '/app' : '/'} class="flex items-center">
			<Logo class="text-green-500 size-10" />
		</a>
	</div>

	{#if user}
		<div class="flex-none gap-2">
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 h-10 rounded-full">
						<img alt={user.displayName} src={user.profilePicture} />
					</div>
				</div>
				<ul
					tabindex="-1"
					class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
				>
					<li>
						<a href="/app/me" class="justify-between"> Profile </a>
					</li>
					<li>
						<a href="/app/me/logout">Logout</a>
					</li>
				</ul>
			</div>
		</div>
	{:else if $page.url.pathname !== '/login'}
		<GoogleSignin />
	{/if}
</div>
