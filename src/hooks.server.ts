import { SvelteKitAuth } from '@auth/sveltekit';
import { InvictusBierProvider } from './providers/ibs';
import { IBS_CLIENT_SECRET } from '$env/static/private';

export const handle = SvelteKitAuth({
	providers: [InvictusBierProvider],
	secret: IBS_CLIENT_SECRET,
});
