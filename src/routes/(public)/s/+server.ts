import { redirect } from '@sveltejs/kit'

export async function GET() {
	redirect(302, '/short')
}
