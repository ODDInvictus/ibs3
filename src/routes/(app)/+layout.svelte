<script lang="ts">
	import Navbar from './_navbar.svelte'
	import Topbar from './_topbar.svelte'
	import Toast from '$lib/components/toast.svelte'
	import Confirm from '$lib/components/confirm.svelte'
	import Prompt from '$lib/components/prompt.svelte'
	import PromptSelect from '$lib/components/prompt-select.svelte'
	import PromptCheckbox from '$lib/components/prompt-checkbox.svelte'
	import ImagePreview from '$lib/components/image-popup.svelte'
	import { afterNavigate } from '$app/navigation'
	import { Modals, closeModal } from 'svelte-modals'
	import MobileMenu from './_mobile-menu.svelte'
	import { getFlash } from 'sveltekit-flash-message'
	import { page } from '$app/stores'
	import { toast } from '$lib/notification'
	import type { PageData } from './$types'

	export let data: PageData

	const flash = getFlash(page)

	flash.subscribe($flash => {
		if (!$flash) return

		toast({
			type: $flash.type,
			title: $flash.title,
			message: $flash.message,
		})

		flash.set(undefined)
	})

	afterNavigate(() => {
		// Reset scroll position on layout--container-slot
		const slot = document.querySelector('.layout--container')

		if (slot) slot.scrollTop = 0

		open = false
	})

	let open = false
	const openMenu = () => (open = !open)
</script>

<main class="layout--main">
	<Navbar {openMenu} {open} version={data.version} />

	{#if open}
		<div class="layout--mobimenu">
			<MobileMenu version={data.version} />
		</div>
	{/if}

	<Modals>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div slot="backdrop" class="backdrop" role="button" tabindex="0" on:click={closeModal} />
	</Modals>

	<div class="layout--stripe" data-open={open} />

	<Topbar />

	{#if !open}
		<div class="layout--container">
			<div class="layout--container-slot">
				<slot />
			</div>
		</div>
	{/if}

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

	<div class="layout--overlay">
		<ImagePreview />
	</div>
</main>

<style>
	.backdrop {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 99;
	}
</style>
