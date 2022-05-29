import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	LinearProgress,
} from '@mui/material';
import { useConnection, useGlobals, useI18n } from 'iobroker-react/hooks';
import React, { useState } from 'react';
import { AddTableDialog } from '../component/AddTableDialog';
import { AlertComponent } from '../component/AlertComponent';
import { checkNewRow, CheckNewRow } from '../lib/CheckNewRow';
import { handeValidateOnServer, SentToServer } from '../lib/ValidateOnBackend';
import { Valid } from '../type/Interfaces';

export interface AddModalProps {
	alive: boolean;
	newRow: (value: ioBroker.Devices) => void;
	mqtt: {
		mqttEnabled: boolean;
		mqttAvailable: boolean;
	};
	currentRows: ioBroker.Devices[];
}

let timeoutProgress: NodeJS.Timeout;
let timeoutClose: NodeJS.Timeout;
let searchTimeout: NodeJS.Timeout;
export const AddModal: React.FC<AddModalProps> = ({ alive, newRow, mqtt, currentRows }): JSX.Element => {
	const { namespace } = useGlobals();
	const connection = useConnection();
	const [open, setOpen] = useState<boolean>(false);
	const [row, setRow] = useState<ioBroker.Devices>({
		enabled: false,
		ip: '',
		name: '',
		port: 0,
		topic: '',
		mqttEnabled: false,
	});
	const [validRow, setValidRow] = useState<Valid>({ name: true, ip: true, port: true, topic: true });
	const [alert, setAlert] = useState({
		message: '',
		open: false,
	});
	const [success, setSuccess] = useState({
		message: '',
		open: false,
	});
	const [progress, setProgress] = useState(false);
	const { translate: _ } = useI18n();

	const handleAdd = async (typ: string, row: ioBroker.Devices | { cancel: true }): Promise<void> => {
		const result: SentToServer | void = await handeValidateOnServer(connection, namespace, typ, row);
		if (result) {
			if (result.code === 'canceled') {
				setAlert({ message: result.alert.message, open: false });
				setProgress(false);
				return;
			}
			if (result.code !== 200) {
				setProgress(result.loading);
				setAlert({ message: result.alert.message, open: result.alert.open });
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
						newRow(result.newRow as ioBroker.Devices);
						// close the dialog
						setOpen(false);
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

	const handleClickAdd = async (currentRows: ioBroker.Devices[]): Promise<void> => {
		setAlert({ message: '', open: false });
		setSuccess({ message: '', open: false });
		setProgress(true);
		const checkRow: CheckNewRow = await checkNewRow('add', currentRows, row);

		if (checkRow.code === 'clear') {
			await handleAdd('add', row);
		} else if (checkRow.code === 'foundName') {
			if (searchTimeout) clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => {
				setProgress(false);
				setAlert({ message: _('nameInUse', row.name), open: true });
				return;
			}, 1000);
		} else if (checkRow.code === 'foundIp') {
			if (searchTimeout) clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => {
				setProgress(false);
				setAlert({ message: _('ipInUse', row.ip), open: true });
				return;
			}, 1000);
		}
	};

	const handleClickOpen = (): void => {
		setOpen(true);
	};

	const handleClose = async (): Promise<void> => {
		setOpen(false);
		if (progress) await handleAdd('cancel', { cancel: true });
		setAlert({ message: '', open: false });
		setSuccess({ message: '', open: false });
		setProgress(false);
	};

	const isRowValid = (): boolean => {
		return mqtt.mqttEnabled && mqtt.mqttAvailable && row.mqttEnabled
			? !(validRow.name && validRow.ip && validRow.port && validRow.topic)
			: !(validRow.name && validRow.ip && validRow.port && !validRow.topic);
	};

	return (
		<React.Fragment>
			<Grid
				container
				spacing={1}
				sx={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-around' }}
			>
				<Button variant="contained" size="large" color={'primary'} onClick={handleClickOpen}>
					{_('addDevice')}
				</Button>
			</Grid>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle
					sx={{
						textAlignLast: 'center',
						fontSize: '1.4rem',
					}}
				>
					{_('addNewDevice')}
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
						<AddTableDialog
							valid={(value) => setValidRow(value)}
							addRow={(value) => setRow(value)}
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
					<Button disabled={isRowValid()} onClick={() => handleClickAdd(currentRows)}>
						{_('add')}
					</Button>
					<Button onClick={handleClose}>{_('cancel')}</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};
