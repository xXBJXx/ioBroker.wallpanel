//noinspection AllyJsxHardcodedStringInspection

import { Description, GitHub } from '@mui/icons-material';
import { Fab, Grid, Stack, Tooltip } from '@mui/material';
import { useI18n } from 'iobroker-react/hooks';
import React from 'react';

const Url = {
	issues: 'https://github.com/xXBJXx/ioBroker.wallpanel/issues',
	doc: 'https://xxbjxx.github.io/wallpanel/',
};

export const AdapterHeader = (): JSX.Element => {
	const { translate: _ } = useI18n();

	return (
		<Grid container spacing={0}>
			<Grid item xs={4}>
				<img src="wallpanel.png" alt="adapter_icon" style={{ margin: 16, width: 150, height: 150 }} />
			</Grid>
			<Grid
				item
				xs={3}
				sx={{
					right: '0%',
					position: 'absolute',
					display: 'flex',
					width: '100%',
				}}
			>
				<Stack
					direction={{ xs: 'column', sm: 'column', md: 'row' }}
					spacing={{ xs: 1, sm: 2, md: 3 }}
					sx={{
						width: '100%',
						alignItems: 'center',
					}}
				>
					<Tooltip title={_('tooltipGitHub_Issues')} sx={{ verticalAlign: 'middle' }} arrow>
						<Fab
							href={Url.issues}
							target="_blank"
							rel="noreferrer"
							variant="extended"
							size="large"
							color="primary"
							aria-label="GitHub Issues"
						>
							<GitHub sx={{ margin: 1, marginLeft: '1%' }} />
							GitHub Issues
						</Fab>
					</Tooltip>
					<Tooltip title={_('tooltipDocumentation')} sx={{ verticalAlign: 'middle' }} arrow>
						<Fab
							href={Url.doc}
							target="_blank"
							rel="noreferrer"
							variant="extended"
							size="large"
							color="primary"
							aria-label="Documentation"
						>
							<Description sx={{ margin: 1, marginLeft: 0 }} />
							docs
						</Fab>
					</Tooltip>
				</Stack>
			</Grid>
		</Grid>
	);
};
