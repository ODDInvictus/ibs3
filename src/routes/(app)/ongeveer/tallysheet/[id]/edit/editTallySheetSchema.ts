import { z } from 'zod';

// TODO avoid code duplication
export const editTallySheetSchema = z.object({
	begin: z.date().optional(),
	end: z.date().optional(),
	notes: z.string().optional()
});
