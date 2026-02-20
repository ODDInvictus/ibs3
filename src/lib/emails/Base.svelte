<script lang="ts">
	import { env } from '$env/dynamic/private'
	import type { User } from '$lib/server/prisma/client'
	import { Body, Head, Html } from 'svelte-email'

	interface Props {
		user?: User | null
		subject?: string
		isFeut?: boolean
		customGreeting?: string
		customFooter?: string | undefined
		children?: import('svelte').Snippet
	}

	let {
		user = null,
		subject = `IBS Notificatie`,
		isFeut = false,
		customGreeting = `Invictus Bier Systeem`,
		customFooter = undefined,
		children,
	}: Props = $props()
</script>

<Html lang="nl" dir="ltr">
	<Head>
		<meta charset="utf-8" />
		<meta http-equiv="x-ua-compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
		<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
		<meta name="x-apple-disable-message-reformatting" />
		<title>{subject}</title>
	</Head>

	<Body>
		<div class="body">
			<div
				role="article"
				aria-roledescription="email"
				aria-label={subject}
				lang="nl"
				dir="ltr"
				style="font-size:medium; font-size:max(16px, 1rem);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji">
				<!--[if true]>
        <table role='presentation' style='width:37.5em' align='center'><tr><td>
      <![endif]-->
				<!--[if !true]><!-->
				<div style="max-width:600px;margin: 0 auto;">
					<!--<![endif]-->

					<div style="text-align:center;margin-top:32px;width:100%">
						<img src={env.EMAIL_IBS_LOGO} alt="Invictus Bier Systeem" style="width:342px;height:auto;" />
					</div>

					<p>Beste {user?.firstName},</p>
					{@render children?.()}
					<div>
						<!--[if true]>
          <p style="padding:0;margin:0;">Groetjes,</p>
          <![endif]-->
						<!--[if !true]><!-->
						<p style="padding:0;margin:0;margin-top:16px;">Groetjes,</p>
						<!--<![endif]-->
						<p style="padding:0;margin:0;">{customGreeting}</p>

						<hr style="margin:16px 0;width:100%;" />

						<p style="margin-top:16px;">
							{#if customFooter}
								{customFooter}
							{:else}
								Je ontvangt deze e-mail omdat
								{#if isFeut}
									je een feut bent.
								{:else}
									je lid bent van O.D.D. Invictus
								{/if}
							{/if}
						</p>

						<a href="{env.ORIGIN}/instellingen" style="color:#551b8a;">Niet meer zulke e-mails ontvangen?</a>
					</div>

					<!--[if !true]><!-->
				</div>
				<!--<![endif]-->
				<!--[if true]>
        </td></tr></table>
      <![endif]-->
			</div>
		</div>
	</Body>
</Html>
