/**
 * Created by alex-issi on 05.05.22
 */
import { Box, FormControl } from '@mui/material';
import React from 'react';
import { NumberInput } from './NumberInput';

export interface AdapterIntervalProps {
	onChange: (key: keyof ioBroker.AdapterConfig, value: any) => void;
	settings: ioBroker.AdapterConfig;
}

export const AdapterInterval: React.FC<AdapterIntervalProps> = ({ settings, onChange }): JSX.Element => {
	const handeleNumber = (attr: string, value: React.SetStateAction<number | undefined>): void => {
		if (typeof value === 'number') {
			onChange('interval', value);
		}
	};
	return (
		<React.Fragment>
			<Box sx={{ minWidth: 170 }}>
				<FormControl fullWidth>
					<NumberInput
						min={30}
						max={999}
						defaultValue={30}
						label={'interval'}
						tooltip={'intervalTooltip'}
						sx={{ width: '170', textAlignLast: 'center' }}
						value={settings.interval}
						onChange={(value) => handeleNumber('interval', value)}
					/>
				</FormControl>
			</Box>
		</React.Fragment>
	);
};
