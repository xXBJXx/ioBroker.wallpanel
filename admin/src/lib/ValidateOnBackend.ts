import { Connection } from '@iobroker/socket-client';

export interface SentToServer {
	alert: { message: string; open: boolean };
	success: { message: string; open: boolean };
	loading: boolean;
	newRow?: ioBroker.Devices;
	cancel?: boolean;
	open?: boolean;
	code?: string | number;
}

export const handeValidateOnServer = async (
	connection,
	namespace: string,
	type: string,
	row: ioBroker.Devices | { cancel: true },
): Promise<SentToServer | void> => {
	try {
		const result = await connection.sendTo(namespace, type, row);
		if (!result) {
			//			console.log('no result');
			return {
				code: undefined,
				alert: { message: `Could not send ${type} to server`, open: true },
				success: { message: '', open: false },
				loading: false,
			};
		}
		// check if result canceled than return
		if (result.message === 'canceled') {
			//			console.log('request canceled');
			return {
				code: result.message,
				alert: { message: 'request canceled', open: false },
				success: { message: '', open: false },
				loading: false,
				cancel: true,
			};
		}
		// check if the result code is 200, if not, there is an error
		if (result.code !== 200) {
			//			console.log('error code: ', result.code);
			return {
				code: result.code,
				alert: { message: result.message, open: true },
				loading: false,
				success: { message: '', open: false },
			};
		} else if (result.code === 200) {
			//			console.log('success code: ', result.code);
			// if the result code is 200, the device is added successfully
			return {
				code: result.code,
				alert: { message: '', open: false },
				success: { message: result.message, open: true },
				loading: false,
				newRow: row as ioBroker.Devices,
				open: false,
			};
		}
	} catch (error) {
		console.log(`error: ${error.message}, stack: ${error.stack}`);
	}
};
