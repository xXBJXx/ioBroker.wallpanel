interface CheckNewRow {
	length?: number;
	alert: { message: string; open: boolean };
	loading: boolean;
	newRow?: any;
	code?: string;
}

const checkNewRow = async (
	type: 'add' | 'edit',
	currentRows: ioBroker.Devices[],
	row: ioBroker.Devices,
	index?: number | null,
): Promise<CheckNewRow> => {
	let foundName: ioBroker.Devices | undefined = undefined;
	let foundIp: ioBroker.Devices | undefined = undefined;
	if (currentRows.length === 0) {
		return {
			length: currentRows.length,
			alert: { message: '', open: false },
			loading: false,
			newRow: row,
			code: 'clear',
		};
	}
	if (type === 'add') {
		foundName = currentRows.find(
			(rows: ioBroker.Devices) => rows.name.toLowerCase() === row.name.toLowerCase(),
		);
		foundIp = currentRows.find((rows: ioBroker.Devices) => rows.ip === row.ip);
	} else if (type === 'edit') {
		if (index) {
			// check if the ip of the index is equal to the ip found in the current rows
			if (currentRows[index].ip === row.ip) {
				foundIp = undefined;
			} else {
				foundIp = currentRows.find((rows: ioBroker.Devices) => rows.ip === row.ip);
			}
		}
	}

	if (foundName) {
		console.log('foundName in your config: ', foundName);
		return {
			alert: { message: 'nameInUse', open: true },
			loading: false,
			code: 'foundName',
		};
	} else if (foundIp) {
		console.log('foundIp: ', foundIp);
		return {
			alert: { message: 'ipInUse', open: true },
			loading: false,
			code: 'foundIp',
		};
	} else {
		console.log('not found');
		return {
			alert: { message: '', open: false },
			loading: false,
			newRow: row,
			code: 'clear',
		};
	}
};

export { checkNewRow, CheckNewRow };
