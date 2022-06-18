/**
 * @description replace all ä,ö,ü,ß and all other special characters
 */
export async function replaceFunktion(text: string): Promise<string> {
	let text2 = text.toLowerCase();
	const replaceArray = [
		{ search: 'ä', replace: 'ae' },
		{ search: 'ö', replace: 'oe' },
		{ search: 'ü', replace: 'ue' },
		{ search: 'ß', replace: 'ss' },
		{ search: '[^a-z0-9]', replace: '_' },
	];

	for (const replace of replaceArray) {
		text2 = text2.replace(new RegExp(replace.search, 'gu'), replace.replace);
	}
	return text2;
}
