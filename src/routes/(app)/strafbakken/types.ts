import type { PageData } from '../$types'
import type { User } from '$lib/server/prisma/client'

// /strafbakken
export interface sbUser extends User {
	_count: {
		StrafbakReceived: number
	}
}

export interface sbPageData extends PageData {
	strafbakken: sbUser[]
}

// /strafbakken/[name]
interface sbDetails {
	reason: string | null
	dateCreated: Date
	giver: {
		nickname: string | null
		firstName: string
	}
	location: string | null
}

export interface sbUserPageData extends PageData {
	strafbakken: {
		firstName: string
		nickname: string | null
		StrafbakReceived: sbDetails[]
	}
}

// /strafbakken/bakken
export interface bakkenUser extends User {
	count: BigInt
}

export interface bakkenPageData extends PageData {
	strafbakken: bakkenUser[]
	week: String | null
}
