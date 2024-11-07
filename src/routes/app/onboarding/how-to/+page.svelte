<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-4">
	<span class="text-xl text-center">A guide on using the app will be here at some point</span>
	<div class="flex items-center justify-center">
		<a href={data.redirect} class="btn btn-primary">Continue</a>
	</div>
</div>
