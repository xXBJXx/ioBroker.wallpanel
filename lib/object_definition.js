const object_command_definitions = {
	'clearCache': {
		type: 'state',
		common: {
			name: `clearCache`,
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
			name: `relaunch`,
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
			name: `reload`,
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
			name: `wake`,
			type: `boolean`,
			role: `button`,
			def: true,
			read: true,
			write: true
		},
		native: {}
	},
	'camera': {
		type: 'state',
		common: {
			name: `camera`,
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
			name: `brightness`,
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
			name: `volume`,
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
			name: `url`,
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
			name: `urlAudio`,
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
			name: `speak`,
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
			name: `eval`,
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
			name: `isWallpanelAlive`,
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
			name: `lastInfoUpdate`,
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