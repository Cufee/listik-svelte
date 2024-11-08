<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from '$lib/server/db/schema';
	import GoogleSignin from './GoogleSignin.svelte';
	import Logo from './Logo.svelte';

	let { user }: { user: User | null } = $props();
</script>

<div class="navbar bg-base-100 p-0">
	<div class="flex-1">
		<a href={!!user ? '/app' : '/'} class="flex items-center">
			<Logo class="size-10 text-primary" />
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
