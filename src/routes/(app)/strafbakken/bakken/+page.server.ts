import db from "$lib/server/db";
import type { PageServerLoad } from "./$types";

function getDateOfISOWeek(w: number, y: number) {
  const simple = new Date(y, 0, 1 + (w - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

function getCurrentWeekNumber() {
  const current = new Date();
  const start = new Date(current.getFullYear(), 0, 1);
  // @ts-expect-error
  const days = Math.floor((current - start) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
}

export const load = (async ({ url }) => {
  const week = url.searchParams.get("week");
  let weekNumber = Number(week);

  let dateStart = new Date("2003-04-14");
  let dateEnd = new Date();

  if (week !== null && week !== undefined && weekNumber <= 52 && weekNumber >= 0) {
    const current = getCurrentWeekNumber();
    if (weekNumber === 0) weekNumber = current;

    const currentYear = new Date().getFullYear();
    const year = current > weekNumber ? currentYear - 1 : currentYear;
    dateStart = getDateOfISOWeek(weekNumber, year);

    dateEnd.setDate(dateStart.getDate() + 7);
  }

  console.log(dateStart, dateEnd)

  // Hoeren prisma kan deze query gewoon NIET.
  return {
    strafbakken: await db.$queryRaw`
      SELECT u.nickname, u.firstname AS firstName, COUNT(s.id) AS count, u.id
      FROM User AS u, Strafbak AS s
      WHERE s.receiverId = u.id
      AND s.dateDeleted IS NOT NULL
      AND s.dateDeleted >= ${dateStart}
      AND s.dateDeleted <= ${dateEnd}
      GROUP BY u.id
      ORDER BY COUNT(s.id) DESC
    `,
    week: week,
  };
}) satisfies PageServerLoad;

// Deze approach werkt niet, want je mag geen select in een groupBy doen

// return {
//   strafbakken: await db.strafbak.groupBy({
//     by: ["receiverId"],
//     where: {
//       dateDeleted: {
//         not: null,
//       },
//     },
//     _count: {
//       id: true,
//     },
//     select: {                        | Dit mag dus niet
//       receiver: { firstName: true }  |
//     }                                |
//   }),
// };

// Deze approach werkt niet, want je mag geen WHERE doen in StrafbakReceived

// strafbakken: await db.user.findMany({
//   select: {
//     firstName: true,
//     nickname: true,
//     _count: {
//       select: {
//         StrafbakReceived: {
//           where: {
//             dateDeleted: null,
//           },
//         },
//       },
//     },
//   },
//   orderBy: {
//     StrafbakReceived: {
//       where: {                     | Dit mag dus niet
//         NOT: {                     |
//           dateDeleted: null,       |
//         },                         |
//       },                           |
//       _count: "desc",
//     },
//   },
// }),
