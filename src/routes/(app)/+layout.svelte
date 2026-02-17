<script lang="ts">
	import Navbar from './_navbar.svelte'
	import Topbar from './_topbar.svelte'
	import Toast from '$lib/components/toast.svelte'
	import Confirm from '$lib/components/confirm.svelte'
	import Prompt from '$lib/components/prompt.svelte'
	import PromptSelect from '$lib/components/prompt-select.svelte'
	import PromptCheckbox from '$lib/components/prompt-checkbox.svelte'
	import Alert from '$lib/components/alert.svelte'
	import ImagePreview from '$lib/components/image-popup.svelte'
	import { afterNavigate, onNavigate } from '$app/navigation'
	import { Modals, closeModal } from 'svelte-modals/legacy'
	import MobileMenu from './_mobile-menu.svelte'
	import { getFlash } from 'sveltekit-flash-message'
	import { navigating, page } from '$app/state'
	import { toast } from '$lib/notification'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
		children?: import('svelte').Snippet
	}

	let { data, children }: Props = $props()

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

	let url = $state(page.url)

	$effect(() => {
		if (url != page.url) {
			url = page.url
			const slot = document.querySelector('.layout--container')

			if (slot) slot.scrollTop = 0

			open = false
		}
	})

	let open = $state(false)
	const openMenu = () => {
		open = !open
	}
</script>

<main class="layout--main">
	<Navbar {openMenu} {open} version={data.version} />
	{#if open}
		<div class="layout--mobimenu">
			<MobileMenu version={data.version} />
		</div>
	{/if}

	<Modals>
		{#snippet backdrop()}
			<div class="backdrop" role="button" tabindex="0" onclick={closeModal}></div>
		{/snippet}
	</Modals>

	<div class="layout--stripe" data-open={open}></div>

	<Topbar adminAlert={data.adminAlert} />

	{#if !open}
		<div class="layout--container">
			<div class="layout--container-slot">
				{@render children?.()}
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

	<div class="layout--overlay">
		<Alert />
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
