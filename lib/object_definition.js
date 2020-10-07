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

const object_mqttBattery_definitions = {
	'battery': {
		type: 'state',
		common: {
			name: `battery`,
			type: `number`,
			role: `value.battery`,
			unit: '%',
			def: 0,
			read: true,
			write: false
		},
		native: {}
	},
	'acPlugged': {
		type: 'state',
		common: {
			name: `acPlugged`,
			type: `boolean`,
			role: `indicator`,
			def: false,
			read: true,
			write: false
		},
		native: {}
	},
	'usbPlugged': {
		type: 'state',
		common: {
			name: `usbPlugged`,
			type: `boolean`,
			role: `indicator`,
			def: false,
			read: true,
			write: false
		},
		native: {}
	},
	'charging': {
		type: 'state',
		common: {
			name: `charging`,
			type: `boolean`,
			role: `indicator`,
			def: false,
			read: true,
			write: false
		},
		native: {}
	},
}

const object_mqttLight_definitions = {
	'light': {
		type: 'state',
		common: {
			name: `light`,
			type: `number`,
			role: `indicator`,
			unit: 'lx',
			def: 0,
			read: true,
			write: false
		},
		native: {}
	},
	'id': {
		type: 'state',
		common: {
			name: `light id`,
			type: `string`,
			role: `text`,
			def: '',
			read: true,
			write: false
		},
		native: {}
	}
}

const object_mqttMagneticField_definitions = {
	'magneticField': {
		type: 'state',
		common: {
			name: `magneticField`,
			type: `number`,
			role: `indicator`,
			unit: 'uT',
			def: 0,
			read: true,
			write: false
		},
		native: {}
	}
}

const object_mqttPressure_definitions = {
	'pressure': {
		type: 'state',
		common: {
			name: `pressure`,
			type: `number`,
			role: `indicator`,
			unit: 'hPa',
			def: 0,
			read: true,
			write: false
		},
		native: {}
	}
}

const object_mqttTemperature_definitions = {
	'temperature': {
		type: 'state',
		common: {
			name: `temperature`,
			type: `number`,
			role: `value.temperature`,
			unit: '°C',
			def: 0,
			read: true,
			write: false
		},
		native: {}
	}
}

const object_mqttMotion_definitions = {
	'motion': {
		type: 'state',
		common: {
			name: `motion`,
			type: `boolean`,
			role: `sensor.motion`,
			def: false,
			read: true,
			write: false
		},
		native: {}
	}
}

const object_mqttFace_definitions = {
	'face': {
		type: 'state',
		common: {
			name: `face`,
			type: `boolean`,
			role: `indicator`,
			def: false,
			read: true,
			write: false
		},
		native: {}
	}
}

const object_mqttQrcode_definitions = {
	'qrcode': {
		type: 'state',
		common: {
			name: `QR-Code`,
			type: `string`,
			role: `text`,
			def: '',
			read: true,
			write: false
		},
		native: {}
	}
}

module.exports = {object_command_definitions, object_info_definitions, object_mqttBattery_definitions, object_mqttLight_definitions, object_mqttPressure_definitions,
	object_mqttTemperature_definitions, object_mqttMotion_definitions, object_mqttFace_definitions, object_mqttQrcode_definitions, object_mqttMagneticField_definitions};
