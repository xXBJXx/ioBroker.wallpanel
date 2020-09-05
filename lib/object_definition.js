const object_command_definitions = {
	'clearCache': {
		type: 'state',
		common: {
			name: `Clears the browser cache`,
			type: `boolean`,
			role: `button`,
			def: true,
			read: true,
			write: true
		},
		native: {}
	},
	'relaunch': {
		type: 'state',
		common: {
			name: `Relaunches the dashboard from configured launchUrl`,
			type: `boolean`,
			role: `button`,
			def: true,
			read: true,
			write: true
		},
		native: {}
	},
	'reload': {
		type: 'state',
		common: {
			name: `Reloads the current page immediately`,
			type: `boolean`,
			role: `button`,
			def: true,
			read: true,
			write: true
		},
		native: {}
	},
	'wake': {
		type: 'state',
		common: {
			name: `Turn the screen on and off`,
			type: `boolean`,
			role: `switch`,
			def: false,
			read: true,
			write: true
		},
		native: {}
	},
	'camera': {
		type: 'state',
		common: {
			name: `Turns on/off camera streaming`,
			type: `boolean`,
			role: `button`,
			def: true,
			read: true,
			write: true
		},
		native: {}
	},
	'brightness': {
		type: 'state',
		common: {
			name: `Changes the screens brightness`,
			type: `number`,
			role: `level.brightness`,
			read: true,
			write: true,
			min: 0,
			max: 255,
			def: 255

		},
		native: {}
	},
	'volume': {
		type: 'state',
		common: {
			name: `Changes the audio volume`,
			type: `number`,
			role: `level.volume`,
			read: true,
			write: true,
			def: 0,
			unit: '%',
			min: 0,
			max: 100
		},
		native: {}
	},
	'url': {
		type: 'state',
		common: {
			name: `Browse to a new URL immediately`,
			type: `string`,
			role: `url`,
			def: '',
			read: true,
			write: true
		},
		native: {}
	},
	'urlAudio': {
		type: 'state',
		common: {
			name: `Play the audio specified by the URL immediately`,
			type: `string`,
			role: `url.audio`,
			def: '',
			read: true,
			write: true
		},
		native: {}
	},
	'speak': {
		type: 'state',
		common: {
			name: `Uses the devices TTS to speak the message`,
			type: `string`,
			role: `media.tts`,
			def: '',
			read: true,
			write: true
		},
		native: {}
	},
	'eval': {
		type: 'state',
		common: {
			name: `Evaluates Javascript in the dashboard`,
			type: `string`,
			role: `text`,
			def: '',
			read: true,
			write: true
		},
		native: {}
	}
}

const object_info_definitions = {
	'isWallpanelAlive': {
		type: 'state',
		common: {
			name: `Alive status of the device`,
			type: 'boolean',
			role: 'indicator.connected',
			def: false,
			read: true,
			write: false
		},
		native: {}
	},
	'lastInfoUpdate': {
		type: 'state',
		common: {
			name: `Last update of the states`,
			type: `boolean`,
			role: `value.time`,
			def: '',
			read: true,
			write: false
		},
		native: {}
	},
	'ip': {
		type: 'state',
		common: {
			name: `Ip address of the device `,
			type: `string`,
			role: `info.ip`,
			def: '',
			read: true,
			write: false
		},
		native: {}
	},

}

module.exports = {object_command_definitions, object_info_definitions};
