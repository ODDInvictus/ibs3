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

export async function getNextBirthdayInLine(): Promise<User> {
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
    LIMIT 1;
  `) as User[]
	return q[0]
}
