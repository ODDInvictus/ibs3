<script lang="ts">
	import type { PageData } from './$types';
	import Invoice from '../_invoice.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;

	onMount(() => {
		console.log('onMount');
		window.document.close();
		window.focus();
		window.print();
		window.close();
	});
</script>

<Invoice invoice={data.invoice} />
