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
	addRow: (value: ioBroker.Devices) => void;
	valid: (value: Valid) => void;
	mqtt: {
		mqttEnabled: boolean;
		mqttAvailable: boolean;
	};
}

// Regex to validate IP address
const allowedInputRegex = /^\d*\.?\d*\.?\d*\.?\d*$/;
const ipRegex = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?!$)|$)){4}$/; //regex from https://regex101.com/library/ChFXjy

export const AddTableDialog: React.FC<RowProps> = ({ addRow, valid, mqtt }): JSX.Element => {
	const { translate: _ } = useI18n();
	const [validConfig, setValidConfig] = useState<Valid>({
		name: false,
		ip: false,
		port: true,
		topic: false,
	});
	const [name, setName] = useState<string>('');
	const [ip, setIp] = useState<string>('');
	const [port, setPort] = useState<number>(2971);
	const [topic, setTopic] = useState<string>('');
	//	const [topicComplete, setTopicComplete] = useState<string[]>(['wallpanel/']);
	const [enabled, setEnabled] = useState<boolean>(true);
	const [mqttEnabled, setMqttEnabled] = useState<boolean>(false);
	const [newRow, setRow] = useState<ioBroker.Devices>({
		name: '',
		ip: '',
		port: 2971,
		topic: '',
		enabled: true,
		mqttEnabled: false,
	});

	useEffect(() => {
		addRow(newRow);
		valid(validConfig);
		//		console.log('AddTableDialog: useEffect', validConfig);
	}, [newRow]);

	const handleTopicChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		setTopic(event.target.value);
		// disassemble topic in first und second part
		const topicSplit = event.target.value.split('/');
		if (topicSplit.length === 2) {
			let first = topicSplit[0];
			let second = topicSplit[1];

			// remove all Spaces
			first = first.replace(/\s/g, '');
			second = second.replace(/\s/g, '');

			//check ist first and second valid
			if (first.length > 0 && first !== '' && second.length > 0 && second !== '') {
				// valid
				setValidConfig({ ...validConfig, topic: true });
				setRow({ ...newRow, topic: `${first}/${second}` });
			} else {
				// invalid
				setRow({ ...newRow, topic: `${first}/${second}` });
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
			setRow({ ...newRow, [attr]: value });
		}
	};

	const handleIpAddress = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
		newValue: string | any[],
	): void => {
		const length = newValue.length;
		const index = newValue.lastIndexOf('.') + 1;
		let noOfDots = 0;
		if (typeof newValue === 'string') {
			noOfDots = newValue.split('.').length - 1;
		}
		let updatedVal: string | any[] = '';
		if (length !== index && noOfDots < 3 && ip.length < length && (length - index) % 3 == 0) {
			updatedVal = newValue + '.';
		} else if (noOfDots > 3 || length - index > 3) {
			if (typeof newValue === 'string') {
				updatedVal = newValue.substring(0, length - 1);
			}
		} else {
			updatedVal = newValue;
		}
		setIp(updatedVal as string);

		if (updatedVal !== undefined || updatedVal !== '') {
			if (typeof updatedVal !== 'string' || updatedVal?.match(ipRegex)) {
				// valid
				if (typeof updatedVal === 'string') {
					setRow({ ...newRow, ip: updatedVal });
				}
				setValidConfig({ ...validConfig, ip: true });
			} else {
				// invalid
				setRow({ ...newRow, ip: updatedVal });
				setValidConfig({ ...validConfig, ip: false });
			}
		}
	};

	const handleChangeName = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
	): void => {
		const newName: string = event.target.value;

		if (newName !== '') {
			setName(newName);
			setRow({ ...newRow, name: newName });
			setValidConfig({ ...validConfig, name: true });
			//			setTopicComplete([`wallpanel/${newName}`]);
		} else {
			setName('');
			setRow({ ...newRow, name: '' });
			setValidConfig({ ...validConfig, name: false });
			//			setTopicComplete([`wallpanel/`]);
		}
	};

	const handleChangeMqttOn = (event: SelectChangeEvent) => {
		setMqttEnabled(JSON.parse(event.target.value));
		setRow({ ...newRow, mqttEnabled: JSON.parse(event.target.value) });
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
				<Tooltip title={_('tooltipTabletName')} arrow>
					<TextField
						required
						error={!validConfig.name}
						label={_('name')}
						color="success"
						value={name}
						type={'text'}
						placeholder={_('my_tablet_name')}
						inputProps={{
							maxLength: 20,
						}}
						onChange={(event) => {
							handleChangeName(event);
						}}
					/>
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
										handleIpAddress(e, newValue);
									}
								}}
							/>
						</Tooltip>
					</FormControl>
					<FormControl variant="outlined">
						<NumberInput
							min={0}
							max={99999}
							label={'port'}
							tooltip={'tooltipPort'}
							sx={{ width: '12ch', margin: 1, textAlignLast: 'center' }}
							value={port}
							onChange={(value) => handeleNumber('port', value)}
						/>
					</FormControl>
					<FormControl variant="outlined">
						<Tooltip title={_('tooltipEnabled')} arrow placement={'right'}>
							<FormControl fullWidth sx={{ marginLeft: 2, minWidth: 110 }}>
								<InputLabel id="tablet-enabled-select-label">
									{_('tabletEnabled')}
								</InputLabel>
								<Select
									labelId="tablet-enabled-select-label"
									id="tablet-enabled-select"
									value={JSON.stringify(enabled)}
									label={_('tabletEnabled')}
									onChange={(event) => {
										setEnabled(JSON.parse(event.target.value));
									}}
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
					spacing={3}
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
										id="mqtt-topic-complete"
										freeSolo
										options={['wallpanel/']}
										renderInput={(params) => (
											<TextField
												{...params}
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
