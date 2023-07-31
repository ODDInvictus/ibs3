<script>
	import Navbar from './_navbar.svelte';
	import Topbar from './_topbar.svelte';
	import Toast from '$lib/components/toast.svelte';
	import Confirm from '$lib/components/confirm.svelte';
	import Prompt from '$lib/components/prompt.svelte';
	import PromptSelect from '$lib/components/prompt-select.svelte';
	import PromptCheckbox from '$lib/components/prompt-checkbox.svelte';
	import { afterNavigate } from '$app/navigation';

	afterNavigate(() => {
		// Reset scroll position on layout--container-slot
		const slot = document.querySelector('.layout--container');

		if (slot) slot.scrollTop = 0;
	});
</script>

<main class="layout--main">
	<Navbar />
	<div class="layout--stripe" />
	<Topbar />
	<div class="layout--container">
		<div class="layout--container-slot">
			<slot />
		</div>
	</div>

	<div class="layout--overlay layout--toast">
		<Toast />
	</div>

	<div class="layout--overlay">
		<Confirm />
	</div>

	<div class="layout--overlay">
		<Prompt />
	</div>

	<div class="layout--overlay">
		<PromptSelect />
	</div>

	<div class="layout--overlay">
		<PromptCheckbox />
	</div>
</main>
