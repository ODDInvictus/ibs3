import db from '$lib/server/db'
import type { User } from '$lib/server/prisma/client'

export async function getBirthdaysThisMonth(): Promise<User[]> {
	return await db.$queryRaw`
    SELECT *
    FROM User
    WHERE birthDate IS NOT null
      AND MONTH(birthDate) = MONTH(NOW())
    ORDER BY DAY(birthDate)
  `
}

export async function getBirthdaysInOrder(): Promise<User[]> {
	return await db.$queryRaw`
    SELECT *
    FROM User
    WHERE isActive = 1
    ORDER BY 
        CASE 
            WHEN MONTH(birthDate) > MONTH(CURDATE()) OR (MONTH(birthDate) = MONTH(CURDATE()) AND DAY(birthDate) >= DAY(CURDATE())) THEN
                CONCAT(YEAR(CURDATE()), '-', LPAD(MONTH(birthDate), 2, '0'), '-', LPAD(DAY(birthDate), 2, '0'))
            ELSE
                CONCAT(YEAR(CURDATE()) + 1, '-', LPAD(MONTH(birthDate), 2, '0'), '-', LPAD(DAY(birthDate), 2, '0'))
        END ASC;
  `
}

export async function getNextBirthdaysInLine(): Promise<User[]> {
	const q = (await db.$queryRaw`
    SELECT *
    FROM User
    WHERE isActive = 1
    ORDER BY 
        CASE 
            WHEN MONTH(birthDate) > MONTH(CURDATE()) OR (MONTH(birthDate) = MONTH(CURDATE()) AND DAY(birthDate) >= DAY(CURDATE())) THEN
                CONCAT(YEAR(CURDATE()), '-', LPAD(MONTH(birthDate), 2, '0'), '-', LPAD(DAY(birthDate), 2, '0'))
            ELSE
                CONCAT(YEAR(CURDATE()) + 1, '-', LPAD(MONTH(birthDate), 2, '0'), '-', LPAD(DAY(birthDate), 2, '0'))
        END ASC
    ;
  `) as User[]

	const filtered = q.filter((u): u is User & { birthDate: Date } => u.birthDate != null)

	if (filtered.length == 0) return []

	const res = [filtered[0]]

	const month = filtered[0].birthDate.getMonth()
	const date = filtered[0].birthDate.getDate()

	for (const u of filtered.splice(1)) {
		console.log(u.birthDate, u.firstName, q[0].birthDate)
		if (u.birthDate.getMonth() == month && u.birthDate.getDate() == date) {
			res.push(u)
		} else {
			break
		}
	}

	return res
}
