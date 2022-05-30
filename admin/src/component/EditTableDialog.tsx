/**
 * Created by issi on 31.10.21
 */
import { Autocomplete, Box, FormControl, Grid, TextField, Tooltip } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useI18n } from 'iobroker-react/hooks';
import React, { useEffect, useState } from 'react';
import { Valid } from '../type/Interfaces';
import { NumberInput } from './NumberInput';

export interface RowProps {
	newRow: (value: ioBroker.Devices) => void;
	valid: (value: Valid) => void;
	oldRow: ioBroker.Devices | undefined;
	mqtt: {
		mqttEnabled: boolean;
		mqttAvailable: boolean;
	};
}

const allowedInputRegex = /^\d*\.?\d*\.?\d*\.?\d*$/;
const ipRegex = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?!$)|$)){4}$/; //regex from https://regex101.com/library/ChFXjy

export const EditTableDialog: React.FC<RowProps> = ({ newRow, valid, oldRow, mqtt }): JSX.Element => {
	if (!oldRow) {
		oldRow = oldRow || {
			name: '',
			ip: '',
			port: 2971,
			topic: '',
			enabled: false,
			mqttEnabled: false,
		};
	}
	const { translate: _ } = useI18n();
	const [validConfig, setValidConfig] = useState<Valid>({ ip: true, port: true, topic: true });
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [name, setName] = useState<string>(oldRow.name);
	const [ip, setIp] = useState<string>(oldRow.ip);
	const [port, setPort] = useState<number>(oldRow.port);
	const [topic, setTopic] = useState<string>(oldRow.topic ? oldRow.topic : '');
	const [topicComplete, setTopicComplete] = useState<string[]>([
		oldRow.topic ? oldRow.topic : 'wallpanel/',
	]);
	const [enabled, setEnabled] = useState<boolean>(oldRow.enabled);
	const [mqttEnabled, setMqttEnabled] = useState<boolean>(oldRow.mqttEnabled);
	const [newEditRow, setNewRow] = useState<ioBroker.Devices>(oldRow);

	useEffect(() => {
		// check if a change was made to the newRow
		if (oldRow) {
			if (
				ip !== oldRow.ip ||
				port !== oldRow.port ||
				topic !== oldRow.topic ||
				enabled !== oldRow.enabled ||
				mqttEnabled !== oldRow.mqttEnabled
			) {
				newRow(newEditRow);
			}
		}
	}, [newEditRow]);

	// check if all values are valid
	useEffect(() => {
		// check if a change was made to the newRow
		if (ip) {
			if (ip.length > 0 && ipRegex.test(ip)) {
				setValidConfig({ ...validConfig, ip: true });
			}
		}
		if (port) {
			if (port > 0 && port < 99999) {
				setValidConfig({ ...validConfig, port: true });
			}
		}
		if (topic) {
			const topicSplit = topic.split('/');
			if (topicSplit.length === 2) {
				const first = topicSplit[0];
				const second = topicSplit[1];
				//check ist first and second valid
				if (first.length > 0 && second.length > 0) {
					setValidConfig({ ...validConfig, topic: true });
				} else {
					setValidConfig({ ...validConfig, topic: false });
				}
			} else {
				setValidConfig({ ...validConfig, topic: false });
			}
		} else {
			setValidConfig({ ...validConfig, topic: false });
		}
	}, []);
	//
	useEffect(() => {
		valid(validConfig);
	}, [validConfig]);

	const handleTopicChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		setTopic(event.target.value);
		// disassemble topic in first und second part
		const topicSplit = event.target.value.split('/');
		if (topicSplit.length === 2) {
			const first = topicSplit[0];
			const second = topicSplit[1];
			//check ist first and second valid
			if (first.length > 0 && second.length > 0) {
				// valid
				setValidConfig({ ...validConfig, topic: true });
				setNewRow({ ...newEditRow, topic: `${first}/${second}` });
			} else {
				// invalid
				setValidConfig({ ...validConfig, topic: false });
			}
		} else {
			// invalid
			setValidConfig({ ...validConfig, topic: false });
		}
	};

	const handeleNumber = (attr: string, value: React.SetStateAction<number>): void => {
		if (typeof value === 'number') {
			setPort(value);
			setNewRow({ ...newEditRow, [attr]: value });
		}
	};

	const handleIpAddress = (newValue: string): void => {
		const length = newValue.length;
		const index = newValue.lastIndexOf('.') + 1;
		let noOfDots = 0;
		noOfDots = newValue.split('.').length - 1;
		let updatedVal: string | any[] = '';
		if (length !== index && noOfDots < 3 && ip.length < length && (length - index) % 3 == 0) {
			updatedVal = newValue + '.';
		} else if (noOfDots > 3 || length - index > 3) {
			updatedVal = newValue.substring(0, length - 1);
		} else {
			updatedVal = newValue;
		}

		setNewRow({ ...newEditRow, ip: updatedVal });

		if (updatedVal !== undefined || updatedVal !== '') {
			if (updatedVal?.match(ipRegex)) {
				// valid
				setIp(updatedVal);
				setNewRow({ ...newEditRow, ip: updatedVal });
				setValidConfig({ ...validConfig, ip: true });
			} else {
				// invalid
				setIp(updatedVal);
				setValidConfig({ ...validConfig, ip: false });
			}
		}
	};

	const handleCheckbox = (event: SelectChangeEvent): void => {
		setEnabled(JSON.parse(event.target.value));
		setNewRow({ ...newEditRow, enabled: JSON.parse(event.target.value) });
	};

	const handleChangeMqttOn = (event: SelectChangeEvent): void => {
		setMqttEnabled(JSON.parse(event.target.value));
		setNewRow({ ...newEditRow, mqttEnabled: JSON.parse(event.target.value) });
	};

	return (
		<React.Fragment>
			<Grid
				container
				spacing={3}
				sx={{
					marginTop: '10px',
					paddingBottom: '15px',
					alignItems: 'center',
					justifyContent: 'space-around',
					display: 'flex',
					flexWrap: 'nowrap',
					flexDirection: 'row',
				}}
			>
				<Tooltip title={_('tooltipTabletEditName')} arrow>
					<TextField disabled label={_('name')} value={name} type={'text'} />
				</Tooltip>
			</Grid>
			<Grid
				container
				spacing={3}
				sx={{
					marginTop: '0',
					paddingBottom: '15px',
					alignItems: 'center',
					justifyContent: 'space-around',
					display: 'flex',
					flexWrap: 'nowrap',
					flexDirection: 'row',
				}}
			>
				<React.Fragment>
					<FormControl variant="outlined">
						<Tooltip title={_('tooltipIp')} arrow>
							<TextField
								required
								variant="outlined"
								error={!validConfig.ip}
								color="success"
								label={_('ipAddress')}
								value={ip}
								type="text"
								placeholder="192.0.0.1"
								sx={{ width: '23ch', margin: 1 }}
								inputProps={{
									maxLength: 15,
								}}
								onChange={(e) => {
									const newValue = e.target.value;

									if (allowedInputRegex.test(newValue)) {
										handleIpAddress(newValue);
									}
								}}
							/>
						</Tooltip>
					</FormControl>
					<NumberInput
						min={0}
						max={99999}
						label={'port'}
						tooltip={'tooltipPort'}
						sx={{ width: '12ch', margin: 1, textAlignLast: 'center' }}
						value={port}
						onChange={(value) => handeleNumber('port', value)}
					/>
					<FormControl variant="outlined">
						<Tooltip title={_('tooltipEnabled')} arrow>
							<FormControl fullWidth sx={{ marginLeft: 2, minWidth: 110 }}>
								<InputLabel id="tablet-enabled-select-label">{_('tabletEnabled')}</InputLabel>
								<Select
									labelId="tablet-enabled-select-label"
									id="tablet-enabled-select"
									value={JSON.stringify(enabled)}
									label={_('tabletEnabled')}
									onChange={handleCheckbox}
								>
									<MenuItem value={'true'} key={'true'}>
										{_('tabletOn')}
									</MenuItem>
									<MenuItem value={'false'} key={'false'}>
										{_('tabletOff')}
									</MenuItem>
								</Select>
							</FormControl>
						</Tooltip>
					</FormControl>
				</React.Fragment>
			</Grid>
			{mqtt.mqttEnabled && mqtt.mqttAvailable ? (
				<Grid
					container
					spacing={2}
					sx={{
						marginTop: '0',
						paddingBottom: '15px',
						alignItems: 'center',
						justifyContent: 'space-evenly',
						display: 'flex',
						flexWrap: 'nowrap',
						flexDirection: 'row',
					}}
				>
					<Box
						sx={{
							minWidth: 360,
							maxWidth: 360,
							marginTop: 2,
							marginBottom: 4,
							display: 'flex',
							flexWrap: 'nowrap',
							justifyContent: 'space-evenly',
						}}
					>
						{mqttEnabled ? (
							<FormControl variant="outlined" sx={{ minWidth: 200 }}>
								<Tooltip title={_('tooltipTopic')} arrow placement={'left'}>
									<Autocomplete
										id="Edit-mqtt-topic-complete"
										freeSolo
										options={topicComplete}
										value={topic}
										renderInput={(params) => (
											<TextField
												{...params}
												required
												error={!validConfig.topic}
												label={_('topic')}
												color="success"
												value={topic}
												type={'text'}
												placeholder="wallpanel/samsung"
												onChange={(event) => {
													handleTopicChange(event);
												}}
											/>
										)}
									/>
								</Tooltip>
							</FormControl>
						) : null}
						<FormControl variant="outlined">
							<Tooltip title={_('tooltipTabletMqttEnabled')} arrow placement={'right'}>
								<FormControl fullWidth sx={{ marginLeft: 2, minWidth: 110 }}>
									<InputLabel id="tablet-mqtt-enabled-select-label">
										{_('tabletMqttEnabled')}
									</InputLabel>
									<Select
										labelId="tablet-mqtt-enabled-select-label"
										id="tablet-mqtt-enabled-select"
										value={JSON.stringify(mqttEnabled)}
										label={_('tabletMqttEnabled')}
										onChange={handleChangeMqttOn}
									>
										<MenuItem value={'true'} key={'true'}>
											{_('mqttOn')}
										</MenuItem>
										<MenuItem value={'false'} key={'false'}>
											{_('mqttOff')}
										</MenuItem>
									</Select>
								</FormControl>
							</Tooltip>
						</FormControl>
					</Box>
				</Grid>
			) : null}
		</React.Fragment>
	);
};
