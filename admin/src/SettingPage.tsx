import { Grid } from '@mui/material';
import { useAdapter } from 'iobroker-react/hooks';
import React, { useState } from 'react';
import { AdapterInterval } from './component/AdapterInterval';
import { TabletCard } from './component/TabletCard';
import { AddModal } from './modal/AddModal';
import { DeleteConfirmModal } from './modal/DeleteConfirmModal';
import { EditModal } from './modal/EditModal';
import { Mqtt } from './Mqtt';

interface SettingPageProps {
	onChange: (key: keyof ioBroker.AdapterConfig, value: any) => void;
	settings: ioBroker.AdapterConfig;
	mqttInstance: string[];
}

let newRow: any = [];

export const SettingPage: React.FC<SettingPageProps> = ({
	onChange,
	settings,
	mqttInstance,
}): JSX.Element => {
	const { alive } = useAdapter();
	const [mqttEnabled, setMqttEnabled] = React.useState(false);
	const [mqttAvailable, setMqttAvailable] = React.useState(false);
	const [editModal, setEditModal] = useState<{
		open: boolean;
		index: number | null;
		oldRow?: ioBroker.Devices;
	}>({
		open: false,
		index: null,
		oldRow: undefined,
	});
	const [showConfirmDialog, setShowConfirmDialog] = useState({
		open: false,
		name: '',
	});

	React.useEffect(() => {
		if (mqttInstance.length === 0) {
			setMqttAvailable(false);
		} else {
			setMqttAvailable(true);
		}
	}, [mqttInstance]);

	//add row
	const handleAdd = (value: ioBroker.Devices): void => {
		if (newRow.length === 0) {
			newRow = [...settings.devices];
		}
		newRow.push(value);
		onChange('devices', newRow);
	};

	//edit row
	const handleEdit = (value: ioBroker.Devices, index: number | null): void => {
		if (settings.devices.length === 0) {
			settings.devices = [];
		}
		const newRows = [...settings.devices];
		if (index !== null) {
			newRows[index] = value;
		}
		onChange('devices', newRows);
	};

	//delete row
	const handleDeleteRow = (name: string): void => {
		const newRows = settings.devices.filter((row) => row.name !== name);
		newRow = [];
		setShowConfirmDialog({ open: false, name: '' });
		onChange('devices', newRows);
	};

	return (
		<React.Fragment>
			<AdapterInterval onChange={(key, value) => onChange(key, value)} settings={settings} />
			<Grid container spacing={0} sx={{ marginTop: '10px', flexDirection: 'column' }}>
				<Mqtt
					onChange={(key, value) => onChange(key, value)}
					settings={settings}
					mqttInstance={mqttInstance}
					mqttActive={(value) => setMqttEnabled(value)}
				/>
			</Grid>
			<Grid
				container
				spacing={0}
				sx={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}
			>
				<React.Fragment>
					<AddModal
						alive={alive}
						newRow={(value) => handleAdd(value)}
						mqtt={{ mqttEnabled, mqttAvailable }}
						currentRows={settings.devices}
					/>
					<EditModal
						alive={alive}
						newRow={(editRows, index) => handleEdit(editRows, index)}
						currentRows={settings.devices}
						oldRow={editModal.oldRow}
						open={editModal.open}
						onClose={() => setEditModal({ index: null, open: false })}
						index={editModal.index}
						mqtt={{ mqttEnabled, mqttAvailable }}
					/>
					<DeleteConfirmModal
						show={showConfirmDialog.open}
						name={showConfirmDialog.name}
						onClose={() => setShowConfirmDialog({ open: false, name: '' })}
						onDelete={(name) => handleDeleteRow(name)}
					/>
					{settings.devices.map((item, index) => {
						return (
							<TabletCard
								key={`${item.name}${index}`}
								settings={settings}
								item={item}
								index={index}
								mqtt={{ mqttEnabled, mqttAvailable }}
								editModal={(value) => setEditModal(value)}
								deleteModal={(value) => setShowConfirmDialog(value)}
							/>
						);
					})}
				</React.Fragment>
			</Grid>
		</React.Fragment>
	);
};
