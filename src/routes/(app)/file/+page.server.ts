import type { Actions } from './$types';
import { uploadFile } from '$lib/server/mongo';

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const file = formData.get('file') as File;
		await uploadFile(file);

		return { status: 200, body: { message: 'File uploaded successfully' } };
	}
} satisfies Actions;
