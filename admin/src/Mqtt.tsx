/**
 * Created by alex-issi on 05.05.22
 */
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useI18n } from 'iobroker-react/hooks';
import React, { useEffect, useState } from 'react';
import { AlertComponent } from './component/AlertComponent';

export interface MqttProps {
	onChange: (key: keyof ioBroker.AdapterConfig, value: any) => void;
	settings: ioBroker.AdapterConfig;
	mqttInstance: string[];
	mqttActive: (value: boolean) => void;
}

let timeout: NodeJS.Timeout | null = null;
export const Mqtt: React.FC<MqttProps> = ({
	onChange,
	settings,
	mqttInstance,
	mqttActive,
}): JSX.Element => {
	const { translate: _ } = useI18n();
	const [mqttAvailable, setMqttAvailable] = useState<boolean>(false);
	const [selectWidth, setSelectWidth] = useState<number>(170);
	const [mqttAlert, setMqttAlert] = useState<boolean>(false);

	const handleChangeInstance = (event: { target: { value: string } }) => {
		const value = event.target.value as string;
		onChange('mqttInstance', value);
	};
	const handleChangeMqttEnabled = async (event: SelectChangeEvent) => {
		mqttInstance.length !== 0 ? setMqttAvailable(true) : setMqttAvailable(false);

		if (settings.enabledMqtt !== JSON.parse(event.target.value)) {
			onChange('enabledMqtt', JSON.parse(event.target.value));
		}

		mqttActive(JSON.parse(event.target.value));
		if (event.target.value === 'true') {
			if (mqttInstance.length === 0) {
				setMqttAvailable(false);
				setSelectWidth(170);
				setMqttAlert(true);
			} else {
				setSelectWidth(360);
				onChange('enabledMqtt', JSON.parse(event.target.value));
			}
		} else {
			setSelectWidth(170);
			setMqttAlert(true);
			onChange('enabledMqtt', JSON.parse(event.target.value));
		}
	};
	const handleAlertMqttInstance = () => {
		if (settings.enabledMqtt && mqttInstance.length === 0) {
			setMqttAlert(false);
			mqttActive(false);
			onChange('enabledMqtt', false);
		}
	};

	useEffect(() => {
		if (settings.enabledMqtt !== undefined) {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(() => {
				if (settings.enabledMqtt && settings.mqttInstance !== '') {
					if (mqttInstance.length === 0) {
						onChange('enabledMqtt', false);
						mqttActive(false);
						setMqttAvailable(false);
						setSelectWidth(170);
					} else {
						mqttActive(true);
						setMqttAvailable(true);
						setSelectWidth(360);
					}
				} else {
					mqttActive(false);
					setMqttAvailable(false);
					setSelectWidth(170);
				}
			}, 50);
		}
	}, [mqttInstance]);

	return (
		<React.Fragment>
			<Box
				sx={{
					minWidth: selectWidth,
					maxWidth: selectWidth,
					marginTop: 2,
					marginBottom: 4,
					display: 'flex',
					flexWrap: 'nowrap',
				}}
			>
				<Tooltip title={_('tooltipEnableMQTT')} placement={'top'} arrow>
					<FormControl fullWidth>
						<InputLabel id="mqtt-enabled-select-label">{_('enabledMQTT')}</InputLabel>
						<Select
							labelId="mqtt-enabled-select-label"
							id="mqtt-enabled-select"
							value={
								settings.enabledMqtt === undefined
									? 'false'
									: settings.enabledMqtt.toString()
							}
							label={_('enabledMQTT')}
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							onChange={handleChangeMqttEnabled}
						>
							<MenuItem value={'true'}>{_('mqttOn')}</MenuItem>
							<MenuItem value={'false'}>{_('mqttOff')}</MenuItem>
						</Select>
					</FormControl>
				</Tooltip>

				{mqttAvailable && settings.enabledMqtt ? (
					<Tooltip title={_('tooltipMqttInstance')} placement={'top'} arrow>
						<FormControl fullWidth sx={{ marginLeft: 2 }}>
							<InputLabel id="mqtt-instance-select-label">{_('mqttInstance')}</InputLabel>
							<Select
								labelId="mqtt-instance-select-label"
								id="mqtt-instance-select"
								value={
									settings.mqttInstance === '' || undefined || null
										? 'mqtt.0'
										: settings.mqttInstance
								}
								label={_('mqttInstance')}
								onChange={handleChangeInstance}
							>
								<MenuItem disabled value={'mqtt.0'} key={'mqtt'}>
									{_('selectInstance')}
								</MenuItem>
								{mqttAvailable
									? mqttInstance.map((instance: string) => (
											<MenuItem value={instance} key={instance}>
												{instance}
											</MenuItem>
									  ))
									: null}
							</Select>
						</FormControl>
					</Tooltip>
				) : null}
			</Box>
			{!mqttAvailable && settings.enabledMqtt ? (
				<AlertComponent
					collapse={{
						active: true,
						open: mqttAlert,
						onClose: () => handleAlertMqttInstance(),
					}}
					text={'mqttNotInstalled'}
					alertType={'warning'}
					alertTitle={'warning'}
					sx={{ marginBottom: 2, width: '50%' }}
				/>
			) : null}
		</React.Fragment>
	);
};
