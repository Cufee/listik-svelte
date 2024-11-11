<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-4">
	<span class="text-xl text-center">A guide on using the app will be here at some point</span>
	<div class="flex items-center justify-center">
		<a href={data.redirect} class="transition-colors bg-green-400 btn hover:bg-green-500">
			continue to the app
		</a>
	</div>
</div>
