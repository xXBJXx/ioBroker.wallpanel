/**
 * replase all ä,ö,ü,ß and spaces and dots
 */
export async function replaceFunktion(text: string): Promise<string> {
	let text2 = text.toLowerCase();
	text2 = text2.replace(/ä/g, 'ae');
	text2 = text2.replace(/ö/g, 'oe');
	text2 = text2.replace(/ü/g, 'ue');
	text2 = text2.replace(/ß/g, 'ss');
	text2 = text2.replace(/[^a-z0-9]/g, '_');
	return text2;
}
