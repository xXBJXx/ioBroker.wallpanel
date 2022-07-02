/**
 * Created by alex-issi on 29.05.22
 */
import { Delete, Edit } from '@mui/icons-material';
import { Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import { useI18n, useIoBrokerTheme } from 'iobroker-react/hooks';
import React from 'react';

export interface TabletCardProps {
	settings: ioBroker.AdapterConfig;
	item: ioBroker.Devices;
	index: number;
	mqtt: {
		mqttEnabled: boolean;
		mqttAvailable: boolean;
	};
	editModal: (value: { open: boolean; index: number | null; oldRow?: ioBroker.Devices }) => void;
	deleteModal: (value: { open: boolean; name: string }) => void;
}

export const TabletCard: React.FC<TabletCardProps> = ({
	settings,
	item,
	index,
	mqtt,
	editModal,
	deleteModal,
}): JSX.Element => {
	const { translate: _ } = useI18n();
	const [themeName] = useIoBrokerTheme();

	const handleBackgroundColor = () => {
		if (themeName === 'dark') {
			return {
				color: '#f0f0f0',
				cardAction: '#211f1f',
				gradientStart: '#5D5B5BFF',
				gradientEnd: '#2F2D2DFF',
			};
		} else if (themeName === 'blue') {
			return {
				color: '#f0f0f0',
				cardAction: '#1a2426',
				gradientStart: '#415157',
				gradientEnd: '#1e262a',
			};
		} else {
			return {
				color: '#303030',
				cardAction: '#5d5b5b',
				gradientStart: '#cbcbcb',
				gradientEnd: '#726b6b',
			};
		}
	};

	const handleHeaderColor = (index: number) => {
		if (settings.devices[index].enabled) {
			return { backgroundColor: green[800] };
		} else {
			return { backgroundColor: red[800] };
		}
	};

	const handleMqttEnabled = (index: number) => {
		return settings.devices[index].mqttEnabled ? { color: green[800] } : { color: red[800] };
	};

	return (
		<Card
			sx={{
				margin: '10px',
				padding: '10px',
				width: '350px',
				height: '305px',
				maxWidth: '350px',
				maxHeight: '305px',
				borderRadius: '20px',
				boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
				color: handleBackgroundColor().color,
				backgroundImage: `linear-gradient(to right, ${handleBackgroundColor().gradientStart}, ${
					handleBackgroundColor().gradientEnd
				})`,
			}}
		>
			<CardHeader
				sx={{
					margin: '5 5 0 5',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					borderRadius: '15px 15px 0px 0px',
					borderTop: '2.5px solid',
					borderRight: '2.5px solid',
					borderLeft: '2.5px solid',
					borderColor: '#000000',
					paddingTop: '2px',
					paddingBottom: '0px',
					backgroundColor: handleHeaderColor(index).backgroundColor,
					'	.MuiCardHeader-content': {
						display: 'flex',
						alignItems: 'center',
						flexWrap: 'wrap',
						justifyContent: 'center',
						fontSize: '1.3rem',
					},
				}}
				title={item.name}
			/>
			<CardContent
				sx={{
					height: '20px',
					maxHeight: '20px',
					margin: '0 5 0 5',
					borderRight: '2.5px solid',
					borderLeft: '2.5px solid',
					borderColor: '#000000',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexWrap: 'wrap',
					alignContent: 'center',
					fontSize: '1.2rem',
					backgroundColor: handleHeaderColor(index).backgroundColor,
				}}
			>
				{item.enabled ? _(`enabled`) : _('disabled')}
			</CardContent>
			<CardContent
				sx={{
					height: '20px',
					maxHeight: '20px',
					margin: '0 5 0 5',
					borderRight: '2.5px solid',
					borderLeft: '2.5px solid',
					borderColor: 'black',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexWrap: 'wrap',
					alignContent: 'center',
					fontSize: '1.2rem',
					backgroundColor: handleHeaderColor(index).backgroundColor,
				}}
			>
				{`${item.ip}:${item.port}`}
			</CardContent>
			<CardContent
				sx={{
					height: '122px',
					maxHeight: '122px',
					margin: '0 5 0 5',
					borderRight: '2.5px solid',
					borderLeft: '2.5px solid',
					borderColor: 'black',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexWrap: 'wrap',
					flexDirection: 'column',
				}}
			>
				{mqtt.mqttEnabled && mqtt.mqttAvailable ? (
					<React.Fragment>
						<Typography
							variant="body1"
							color="textSecondary"
							component="div"
							sx={{ display: 'flex' }}
						>
							{`${_('mqttEnabled')}:`}{' '}
							{mqtt.mqttEnabled ? (
								<Typography
									variant="body2"
									color="textSecondary"
									component="p"
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: '#f0f0f0',
										borderRadius: '10px',
										padding: '5px',
										marginTop: '-5px',
										backgroundColor: handleMqttEnabled(index).color,
									}}
								>
									{item.mqttEnabled ? _('enabled') : _('disabled')}
								</Typography>
							) : null}
						</Typography>
						{item.mqttEnabled ? (
							<Typography
								variant="body1"
								color="textSecondary"
								component="h5"
								sx={{ display: 'flex', marginRight: '10px' }}
							>
								{`${_(`topic`)}:`}
								<Typography
									variant="body1"
									color="textSecondary"
									component="div"
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										padding: '5',
										marginTop: '-5px',
									}}
								>
									{item.topic}
								</Typography>
							</Typography>
						) : null}
					</React.Fragment>
				) : (
					<React.Fragment>
						{mqtt.mqttEnabled ? (
							<Typography
								variant={mqtt.mqttAvailable ? 'h4' : 'body1'}
								color={orange[700]}
								component={'p'}
							>
								{mqtt.mqttAvailable ? _('mqttDisabled') : _('mqttNotInstalled')}
							</Typography>
						) : (
							<Typography variant="h4" color={orange[700]} component={'p'}>
								{_('mqttDisabled')}
							</Typography>
						)}
					</React.Fragment>
				)}
			</CardContent>
			<CardActions
				disableSpacing
				sx={{
					display: 'flex',
					justifyContent: 'space-around',
					margin: '0 5 5 5',
					borderRadius: '0px 0px 15px 15px',
					borderTop: '1.5px solid',
					borderRight: '2.5px solid',
					borderLeft: '2.5px solid',
					borderBottom: '2.5px solid',
					borderColor: '#000000',
					backgroundColor: handleBackgroundColor().cardAction,
				}}
			>
				<React.Fragment>
					<IconButton
						onClick={() => {
							editModal({ open: true, index, oldRow: item });
						}}
						size="small"
						color="primary"
						aria-label={_('edit')}
					>
						<Edit />
					</IconButton>
					<IconButton
						sx={{
							color: red[500],
						}}
						onClick={() => deleteModal({ open: true, name: item.name })}
						aria-label={_('delete')}
					>
						<Delete />
					</IconButton>
				</React.Fragment>
			</CardActions>
		</Card>
	);
};
