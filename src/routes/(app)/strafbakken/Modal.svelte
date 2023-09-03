<script lang="ts">
	import { closeModal } from 'svelte-modals';
	import { enhance } from '$app/forms';

	export let submitted = false;

	export let isOpen: boolean;
	export let username: string;
	export let uid: number;
	export let changeCount: (index: number, n: number) => void;
	export let index: number;

	let status = {
		bar: '',
		btn: ''
	};

	import { markdown } from '$lib/utils';
	import Markdown from '$lib/components/Markdown.svelte';
	let reason = '';
	$: reasonMarkdown = markdown(reason);
</script>

{#if isOpen}
	<div role="dialog" class="modal">
		<div>
			<div class="contents">
				<h2>{username} verdient een bak!</h2>
				<form
					method="POST"
					use:enhance={(event) => {
						return async ({ result }) => {
							// Zet de strafbakken weer 1 terug als het mislukt is de bak uit de delen.
							if (result.type === 'failure' || result.type === 'error') {
								changeCount(index, -1);
								status.btn = 'error';
								status.bar += ' error';
							}
						};
					}}
					on:submit={(e) => {
						if (submitted) return e.preventDefault();
						submitted = true;
						status.btn = 'active';
						status.bar = 'active';
						changeCount(index, 1);
						setTimeout(() => {
							closeModal();
						}, 1000);
					}}
				>
					<p>Reden:</p>
					<input type="number" name="receiver" hidden value={uid} />
					<textarea name="reason" bind:value={reason} />
					{#if reasonMarkdown && reason !== reasonMarkdown.replaceAll('<br />', '')}
						<Markdown class="md" text={reasonMarkdown} />
					{/if}
					<button type="submit" class={status.btn}> Verzenden </button>
				</form>
			</div>
			<div class={'progress ' + status.bar} />
		</div>
	</div>
{/if}

<style lang="scss">
	$spacing: 1.5em;

	/* Copy pasta styles */
	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		z-index: 100;

		color: black;

		pointer-events: none;
	}

	.contents {
		min-width: 240px;
		border-radius: 6px;
		padding: $spacing;
		background: white;
		display: flex;
		flex-direction: column;
		pointer-events: auto;

		h2 {
			text-align: center;
			font-size: 1.5rem;
		}
	}

	/* Naut's styles */
	form {
		display: flex;
		flex-direction: column;
		margin-top: $spacing;

		input {
			visibility: hidden;
			height: 0;
		}

		textarea {
			margin-bottom: $spacing;
		}

		button {
			width: fit-content;
			display: block;
			margin-left: auto;
			margin-right: auto;
			color: white;
			font-weight: 500;
			font-size: 0.875rem;
			text-align: center;
			padding: 0.625rem 1.25rem;
			background: linear-gradient(
				90deg,
				rgba(144, 97, 249, 1) 0%,
				rgba(126, 58, 242, 1) 50%,
				rgba(108, 43, 217, 1) 100%
			);
			border-radius: 0.5rem;
			transition: all 1s linear;

			&.active {
				background: linear-gradient(
					180deg,
					rgb(0, 255, 0) 0%,
					rgb(20, 230, 20) 50%,
					rgb(40, 200, 40) 100%
				) !important;
			}

			&.error {
				background: linear-gradient(
					180deg,
					rgb(255, 0, 0) 0%,
					rgb(230, 20, 20) 50%,
					rgb(200, 40, 40) 100%
				) !important;
			}

			&:hover {
				background: linear-gradient(
					180deg,
					rgba(144, 97, 249, 1) 0%,
					rgba(126, 58, 242, 1) 50%,
					rgba(108, 43, 217, 1) 100%
				);
			}
		}

		:global(.md) {
			margin-bottom: $spacing;
			max-width: 50vw;
		}
	}

	.progress {
		width: 0px;
		height: 5px;
		background-color: rgb(0, 255, 0);
		transition: width 1s ease;
		display: block;
		margin-left: auto;
		margin-right: auto;
		border-bottom-left-radius: 6px;
		border-bottom-right-radius: 6px;

		&.error {
			background-color: rgb(255, 0, 0);
		}

		&.active {
			width: 95%;
		}
	}
</style>
