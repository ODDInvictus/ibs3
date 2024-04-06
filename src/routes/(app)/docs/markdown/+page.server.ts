export const load = () => {
	return {
		url: process.env.IBS_URL || 'http://localhost:5173',
	}
}
