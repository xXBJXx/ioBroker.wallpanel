/**
 * Created by alex-issi on 08.05.22
 */
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useI18n } from 'iobroker-react/hooks';
import React from 'react';

export interface DeleteConfirmModalProps {
	show: boolean;
	name: string;
	onDelete: (id: string) => void;
	onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
	show,
	name,
	onDelete,
	onClose,
}): JSX.Element => {
	const { translate: _ } = useI18n();

	const handleClose = () => {
		onClose();
	};

	const handleDelete = async () => {
		onDelete(name);
	};

	return (
		<Dialog
			open={show}
			onClose={handleClose}
			aria-labelledby="delete-confirm-dialog-titel"
			aria-describedby="delete-confirm-dialog-description"
		>
			<DialogTitle id="delete-confirm-dialog-title">{_('deleteFor', name)}</DialogTitle>
			<DialogContent dividers id="delete-confirm-dialog-description">
				<React.Fragment>
					<Typography gutterBottom sx={{ color: 'red', fontWeight: 'bold' }}>
						{_(`deleteConfirmation1`)}
					</Typography>
					<Typography gutterBottom sx={{ color: 'red', fontWeight: 'bold' }}>
						{_(`deleteConfirmation2`)}
					</Typography>
				</React.Fragment>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>{_('no')}</Button>
				<Button onClick={handleDelete} autoFocus>
					{_('yes')}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
