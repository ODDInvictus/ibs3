// Render markdown
import markdownIt from 'markdown-it';
// @ts-expect-error Geen types
import markdownItSub from 'markdown-it-sub';
// @ts-expect-error Geen types
import markdownItSup from 'markdown-it-sup';
// @ts-expect-error Geen types
import markdownItIns from 'markdown-it-ins';
import markdownItEmojis from 'markdown-it-emoji';
// @ts-expect-error Geen types
import markdownItArrow from 'markdown-it-smartarrows';
import markdownItKbd from 'markdown-it-kbd';
import markdownItPlainText from 'markdown-it-plain-text';

import xss from 'xss';
import type Decimal from 'decimal.js';

const md = new markdownIt({
	linkify: true,
	breaks: true
})
	.use(markdownItSub)
	.use(markdownItSup)
	.use(markdownItIns)
	.use(markdownItEmojis)
	.use(markdownItArrow)
	.use(markdownItKbd)
	.use(markdownItPlainText)
	.disable(['image']);

export function markdown(text: string | null | undefined): string | null {
	if (text === null || text === undefined) return null;
	return xss(md.renderInline(text));
}

export function stripMarkdown(text: string | undefined) {
	if (text === null || text === undefined) return null;
	md.render(text);
	return (md as any).plainText;
}

// Currently in dark mode?
export function isDarkMode(): boolean {
	return !!document.querySelector(':root')?.classList.contains('dark');
}

// Randomly sort an array where the result is the same every day, but different every day
export function randomSortDay<T>(array: T[]): T[] {
	const date = new Date();
	const num = date.getDate() + date.getMonth() + date.getFullYear();
	return shuffle(array, num);
}

function shuffle<T>(array: T[], num: number): T[] {
	let currentIndex = array.length,
		randomIndex;
	const random = seed(num);

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function seed(s: number) {
	const mask = 0xffffffff;
	let m_w = (123456789 + s) & mask;
	let m_z = (987654321 - s) & mask;

	return function () {
		m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
		m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

		let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
		result /= 4294967296;
		return result;
	};
}

type ICalEventType = {
	title: string;
	eventId: string;
	description?: string;
	location?: string;
	startTime: Date;
	endTime?: Date;
	url?: string;
};

/*
 ICal functions inspired by
 https://github.com/josephj/react-icalendar-link
*/

export function generateICal(event: ICalEventType) {
	const body: string[] = [];

	const endTime: Date = event.endTime ?? new Date(event.startTime.getTime());

	if (!event.endTime) {
		endTime.setHours(endTime.getHours() + 1);
	}

	body.push('BEGIN:VCALENDAR');
	body.push('VERSION:2.0');
	body.push('PRODID:-//O.D.D. Invictus//Invictus Bier Systeem//NL');
	body.push('BEGIN:VEVENT');
	body.push(`DTSTAMP:${formatDate(new Date())}`);
	body.push(`DTSTART:${formatDate(event.startTime)}`);
	body.push(`UID:uid_${event.eventId}.ical@oddinvictus.nl`);
	body.push(`SUMMARY:${event.title}`);
	body.push(`DTEND:${formatDate(endTime)}`);
	if (event.url) body.push(`URL:${event.url}`);
	if (event.description) body.push(`DESCRIPTION:${event.description} \n ${event.url}`);
	if (event.location) body.push(`LOCATION:${event.location}`);
	body.push('END:VEVENT');
	body.push('END:VCALENDAR');

	return `data:text/calendar;charset=utf8,${encodeURIComponent(body.join('\n'))}`;
}

export function formatDate(dateTime: Date): string {
	return [
		dateTime.getUTCFullYear(),
		pad(dateTime.getUTCMonth() + 1),
		pad(dateTime.getUTCDate()),
		'T',
		pad(dateTime.getUTCHours()),
		pad(dateTime.getUTCMinutes()) + '00Z'
	].join('');
}

export function pad(num: number): string {
	if (num < 10) {
		return `0${num}`;
	}
	return `${num}`;
}

export function generateRandomString(length: number) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

// https://stackoverflow.com/a/20732091/11198265
export function formatFileSize(size: number) {
	const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
	return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
}

export function pagination(url: URL) {
	let p = Number(url.searchParams.get('p'));
	if (Number.isNaN(p) || p < 0) p = 0;

	let size = Number(url.searchParams.get('size'));
	if (Number.isNaN(size) || size <= 0) size = 20;

	return { p, size };
}

export function formatMoney(price: number | Decimal | String) {
	return `€ ${Number(price).toFixed(2)}`;
}
