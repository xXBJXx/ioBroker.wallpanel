import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from '@mui/material';
import { useConnection, useGlobals, useI18n } from 'iobroker-react/hooks';
import React, { useState } from 'react';
import { AlertComponent } from '../component/AlertComponent';
import { EditTableDialog } from '../component/EditTableDialog';
import { CheckNewRow, checkNewRow } from '../lib/CheckNewRow';
import { handeValidateOnServer, SentToServer } from '../lib/ValidateOnBackend';
import { Valid } from '../type/Interfaces';

export interface EditModalProps {
	alive: boolean;
	newRow: (value: ioBroker.Devices, index: number | null) => void;
	currentRows: ioBroker.Devices[];
	oldRow: ioBroker.Devices | undefined;
	index: number | null;
	open: boolean;
	onClose: () => void;
	mqtt: {
		mqttEnabled: boolean;
		mqttAvailable: boolean;
	};
}

let timeoutProgress: NodeJS.Timeout;
let timeoutClose: NodeJS.Timeout;
let searchTimeout: NodeJS.Timeout;

export const EditModal: React.FC<EditModalProps> = ({
	alive,
	newRow,
	index,
	currentRows,
	oldRow,
	open,
	onClose,
	mqtt,
}): JSX.Element => {
	const { namespace } = useGlobals();
	const connection = useConnection();
	const [row, setRow] = useState<ioBroker.Devices>(
		oldRow || {
			enabled: false,
			ip: '',
			name: '',
			port: 0,
			topic: '',
			mqttEnabled: false,
		},
	);

	const [validRow, setValidRow] = useState<Valid>({ ip: true, port: true, topic: true });
	const { translate: _ } = useI18n();

	const [alert, setAlert] = useState({
		message: '',
		open: false,
	});
	const [success, setSuccess] = useState({
		message: '',
		open: false,
	});
	const [progress, setProgress] = useState(false);

	// check if row is valid
	const isRowValid = (): boolean => {
		if (mqtt.mqttEnabled && mqtt.mqttAvailable && row.mqttEnabled) {
			return !(validRow.ip && validRow.port && validRow.topic);
		} else {
			return !(validRow.ip && validRow.port);
		}
	};

	const handleAdd = async (typ: string, row: ioBroker.Devices | { cancel: true }): Promise<void> => {
		const result: SentToServer | void = await handeValidateOnServer(connection, namespace, typ, row);
		if (result) {
			if (result.code === 'canceled') {
				setAlert({ message: result.alert.message, open: false });
				setProgress(false);
				//				console.info('code', result.code, 'message: ', result.alert.message);
				onClose();
				return;
			}
			if (result.code !== 200) {
				setProgress(result.loading);
				setAlert({ message: result.alert.message, open: result.alert.open });
				//				console.info('code', result.code, 'message: ', result.alert.message);
				return;
			}
			if (result.code === 200) {
				if (timeoutProgress) clearTimeout(timeoutProgress);
				setAlert({ message: '', open: false });
				// set a 1 seconds timeout for the progress bar and show the success message after that close the dialog
				timeoutProgress = setTimeout(() => {
					// after 1 seconds, the dialog is closed
					if (timeoutClose) clearTimeout(timeoutClose);
					timeoutClose = setTimeout(() => {
						// add the new device to the table
						if (row) {
							newRow(row as ioBroker.Devices, index);
						}
						// close the dialog
						onClose();
						setSuccess({ message: '', open: false });
						return;
					}, 2000);
					// show the success message
					setAlert({ message: result.alert.message, open: result.alert.open });
					setSuccess({ message: result.success.message, open: result.success.open });
					setProgress(false);
				}, 1000);
			}
		} else {
			setProgress(false);
			console.error('Cloud not send the request to the server');
			return;
		}
	};

	const handleSave = async (row: ioBroker.Devices): Promise<void> => {
		setProgress(true);
		setSuccess({ message: '', open: false });
		setAlert({ message: '', open: false });

		if (row.ip !== '') {
			const checkRow: CheckNewRow = await checkNewRow('edit', currentRows, row, index);

			if (checkRow.code === 'clear') {
				await handleAdd('edit', row);
			} else if (checkRow.code === 'foundIp') {
				if (searchTimeout) clearTimeout(searchTimeout);
				searchTimeout = setTimeout(() => {
					setProgress(false);
					setAlert({ message: _('ipInUse', row.ip), open: true });
					return;
				}, 1000);
			}
		} else {
			setProgress(false);
			onClose();
		}
	};
	const handleClose = async (): Promise<void> => {
		if (progress) await handleAdd('cancel', { cancel: true });
		onClose();
	};

	return (
		<React.Fragment>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle
					sx={{
						textAlignLast: 'center',
						fontSize: '1.4rem',
					}}
				>
					{_('editDeviceConfig')}
				</DialogTitle>
				{alive ? (
					<DialogContent
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<EditTableDialog
							newRow={(value) => setRow(value)}
							oldRow={oldRow}
							valid={(value) => setValidRow(value)}
							mqtt={mqtt}
						/>
						{alert.open && open ? (
							<AlertComponent
								collapse={{
									active: false,
									open: false,
								}}
								text={alert.message}
								alertType={'error'}
								alertTitle={'error'}
							/>
						) : null}
						{success.open && open ? (
							<AlertComponent
								collapse={{
									active: false,
									open: false,
								}}
								text={success.message}
								alertType={'success'}
								alertTitle={'success'}
							/>
						) : null}
						{progress && open ? (
							<Box sx={{ width: '100%' }}>
								<LinearProgress />
							</Box>
						) : null}
					</DialogContent>
				) : open ? (
					<DialogContent
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<AlertComponent
							collapse={{
								active: false,
								open: false,
							}}
							text={_('adapterOffline')}
							alertType={'warning'}
							alertTitle={'warning'}
						/>
					</DialogContent>
				) : null}
				<DialogActions>
					<Button disabled={isRowValid()} onClick={() => handleSave(row)}>
						{_('add')}
					</Button>
					<Button onClick={handleClose}>{_('cancel')}</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};
