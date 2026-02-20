import type { LeaderboardTypes } from '$lib/server/prisma/client'

export function calcLeaderboardTime(num: number, type?: LeaderboardTypes) {
	if (num === -1) {
		return 'DNF'
	}

	let firstNum = 0
	let secondNum = 0

	if (type === 'ADTMEISTER') {
		firstNum = num / 100
		secondNum = num % 100
	} else {
		firstNum = num / 60
		secondNum = num % 60
	}

	if (firstNum < 1) return `0:${secondNum < 10 ? '0' : ''}${secondNum}`
	return `${Math.floor(firstNum)}:${secondNum < 10 ? '0' : ''}${secondNum}`
}

export function getLeaderboardName(type: LeaderboardTypes) {
	if (type === 'COUNT') {
		return 'Aantal'
	} else if (type === 'SCORE') {
		return 'Score'
	} else if (type === 'TIME') {
		return 'Tijd'
	} else if (type === 'ADTMEISTER') {
		return 'Tijd'
	}
}
