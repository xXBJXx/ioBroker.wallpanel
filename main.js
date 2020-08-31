'use strict';

/*
 * Created with @iobroker/create-adapter v1.26.3
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
// Load your modules here, e.g.:
const {default: axios} = require('axios');
const objects = require('./lib/object_definition');
const commandObjects = objects.object_command_definitions;
const infoObjects = objects.object_info_definitions;


let requestTimeout = null;
let interval = null;
let stateDelete = null;
const ip = [];
const port = [];
const tabletName = [];
const requestUrl = [];
const sendUrl = [];
const logMessage = [];
const deviceEnabled = [];
const logMessageTimer = [];
const folder = [`command`];
const commandStates = [`clearCache`, `relaunch`, `reload`, `wake`, `camera`, `brightness`, `volume`, `url`, `urlAudio`, `speak`, `eval`];

class Wallpanel extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'wallpanel'
		});

		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		this.on('unload', this.onUnload.bind(this));

	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {

		// Reset the connection indicator during startup
		this.setState('info.connection', false, true);

		// Initialize your adapter here
		await this.initialization();
		this.setState('info.connection', true, true);
		await this.request();

	}

	async initialization() {
		try {

			this.log.debug(`prepare adapter for initialization`);
			// polling min 10 sec.
			interval = this.config.interval * 1000;
			if (interval < 10000) {
				interval = 10000;
			}
			this.log.debug(`Adapter config for interval readout --> ${interval} ms`);


			// ip and port
			const devices = this.config.devices;
			if (!devices && devices.length !== 0 || devices !== [] && devices.length !== 0) {
				for (const i in devices) {

					ip[i] = devices[i].ip;
					port[i] = devices[i].port;
					deviceEnabled[i] = devices[i].enabled;
					stateDelete = this.config.delete;
					const Name = devices[i].name;
					requestUrl[i] = `http://${ip[i]}:${port[i]}/api/state`;
					sendUrl[i] = `http://${ip[i]}:${port[i]}/api/command`;

					this.log.debug(`initialization Ip: ${JSON.stringify(ip)}`);
					this.log.debug(`initialization port: ${JSON.stringify(port)}`);
					this.log.debug(`initialization deviceEnabled: ${JSON.stringify(deviceEnabled)}`);
					this.log.debug(`initialization tabletName: ${Name}`);
					this.log.debug(`initialization requestUrl: ${JSON.stringify(requestUrl)}`);
					this.log.debug(`initialization sendUrl: ${JSON.stringify(sendUrl)}`);

					this.log.debug(`Check whether the IP address is available for the ${Name}`)
					deviceEnabled[i] = ip[i] !== '' && deviceEnabled[i];
					if (ip[i] === '') this.log.debug(`${Name} has no ip address device is not queried`)

					this.log.debug(`it is checked whether the name of the device is entered`)
					// Prepare tablet name
					if (Name !== '') {
						this.log.debug(`the name of the device is entered and is used --> ${Name}`)
						tabletName[i] = await this.replaceFunction(Name);
					}
					else if (deviceEnabled[i]) {
						this.log.debug(`The name of the device is not entered; the IP address is used for the name --> ${ip[i]}`)
						tabletName[i] = await this.replaceFunction(ip[i]);

					}


					this.log.debug(`Tablet name is being prepared: ${tabletName[i]}`);

				}

				if (stateDelete) {
					await this.localDeleteState();
				}


				this.log.debug(`Adapter has been fully initialized`);
			}
			else {
				deviceEnabled[1] = false
			}


		}
		catch (error) {
			this.log.error(`initialization has a problem: ${error.message}, stack: ${error.stack}`);
		}
	}

	async localDeleteState() {
		try {
			this.log.debug(`Adapter has been fully initialized`);
			const device = await this.getDevicesAsync();

			for (const i in device) {
				let nativeIp = null

				this.log.debug(`Adapter has been fully initialized`);
				nativeIp = device[i].native['ip'];

				if (nativeIp !== ip[i]) {

					this.log.debug(`Adapter has been fully initialized`);
					let deviceName = device[i]._id.replace(`${this.namespace}.`, '');

					this.log.debug(`Adapter has been fully initialized`);
					await this.deleteDeviceAsync(`${deviceName}`)
						.catch(async error => {
							if (error !== 'Not exists') {
								this.log.error(`deleteDeviceAsync has a problem: ${error.message}, stack: ${error.stack}`);
							}
							else {
								// do nothing
								console.log(`test`)
							}
						})

					this.log.debug(`device deleted`);
				}
			}
		}
		catch (error) {
			this.log.error(`localDeleteState has a problem: ${error.message}, stack: ${error.stack}`);
		}
	}


	async request() {
		try {
			if (requestTimeout) clearTimeout(requestTimeout);
			if (!requestUrl && requestUrl.length !== 0 || requestUrl !== [] && requestUrl.length !== 0) {
				for (const i in requestUrl) {

					if (deviceEnabled[i]) {

						this.log.debug(`device: ${tabletName[i]} enabled`);

						this.log.debug(`API request started ...`);

						// Try to reach API and receive data
						await axios.get(requestUrl[i])
							.then(async apiResult => {

								if (apiResult['status'] === 200) {
									this.log.debug(`API request ended successfully --> result from api Request: ${JSON.stringify(apiResult['data'])}`);

									this.log.debug(`State Create is now running ...`);
									await this.create_State(apiResult);
									this.log.debug(`State Create was carried out`);

									this.log.debug(`States are now written`);
									await this.state_write(apiResult, i);

									//set is Wallpanel Alive to true if the request was successful
									this.setState(`${tabletName[i]}.isWallpanelAlive`, {val: true, ack: true});
									this.log.debug(`states were written`);

									// clear log message timer
									if (logMessageTimer[i]) clearTimeout(logMessageTimer[i]);
									this.log.debug(`logMessageTimer for ${tabletName[i]} will be deleted`);

									logMessage[i] = false;

									this.log.debug(`logMessage set to ${logMessage[i]} for ${tabletName[i]}`);

								}

							}).catch(async error => {

								if (!logMessage[i]) {

									logMessage[i] = true;
									this.log.debug(`logMessage set to ${logMessage[i]} for ${tabletName[i]}`);

									this.log.error(`[Request] ${tabletName[i]} Unable to contact: ${error} | ${error}`);
								}
								else if (!logMessageTimer[i]) {

									if (logMessageTimer[i]) clearTimeout(logMessageTimer[i]);
									this.log.debug(`logMessageTimer for ${tabletName[i]} will be deleted`);

									this.log.debug(`set logMessageTimer for ${tabletName[i]} to ${3600000 / 60000} min`);
									logMessageTimer[i] = setTimeout(async () => {

										logMessage[i] = false;
										this.log.debug(`logMessage set to ${logMessage[i]} for ${tabletName[i]}`);

									}, 3600000);
								}

								this.setState(`${tabletName[i]}.isWallpanelAlive`, {val: false, ack: true});
								this.log.debug(`set isWallpanelAlive to false for ${tabletName[i]}`);

							})
						this.setState(`${tabletName[i]}.lastInfoUpdate`, {val: Date.now(), ack: true});
						this.log.debug(`The last update of the state was on: ${Date.now()}`);
					}
				}
				this.log.debug(`set requestTimeout to ${interval / 1000} sec`);
				requestTimeout = setTimeout(async () => {

					this.log.debug(`request is restarted`);
					await this.request();

				}, interval);
			}
		}
		catch (error) {
			this.log.error(`[Request function] has a problem: ${error.message}, stack: ${error.stack}`);
		}

	}

	async state_write(res, index) {
		try {

			this.log.debug(`Preparation for the state write....`);
			const requestStates = Object.keys(res['data']);

			this.log.debug(`stats are written now`)
			for (const r in requestStates) {

				let result = Object.values(res['data'])[r];

				await this.setStateAsync(`${tabletName[index]}.${requestStates[r]}`, {val: result, ack: true});

			}
			await this.setStateAsync(`${tabletName[index]}.${Object.keys(infoObjects)[2]}`, {val: ip[index], ack: true});

		}
		catch (error) {
			this.log.error(`state_write has a problem: ${error.message}, stack: ${error.stack}`);
		}
	}

	async sendCommand(id, state, index, cmd) {

		let value = state.val;

		switch (cmd) {

			case `${commandStates[0]}`:

				if (value === false) {
					value = true;
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ clearCache ] is being sent with value: ${value}`);
				await axios.post(sendUrl[index], {'clearCache': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ clearCache ] command was sent successfully Status: ${result['statusText']}`);

						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ clearCache ] command: ${error.message}, stack: ${error.stack}`);
					})
				break;

			case `${commandStates[1]}`:

				if (value === false) {
					value = true;
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ relaunch ] is being sent with value: ${value}`);

				await axios.post(sendUrl[index], {'relaunch': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ relaunch ] command was sent successfully Status: ${result['statusText']}`);

						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ relaunch ] command: ${error.message}, stack: ${error.stack}`);
					})

				break;

			case `${commandStates[2]}`:

				if (value === false) {
					value = true;
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ reload ] is being sent with value: ${value}`);

				await axios.post(sendUrl[index], {'reload': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ reload ] command was sent successfully Status: ${result['statusText']}`);

						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ reload ] command: ${error.message}, stack: ${error.stack}`);
					})

				break;

			case `${commandStates[3]}`:

				if (value === false) {
					value = true;
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ wake ] is being sent with value: ${value}`);

				await axios.post(sendUrl[index], {'wake': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ wake ] command was sent successfully Status: ${result['statusText']}`);

						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ wake ] command: ${error.message}, stack: ${error.stack}`);
					})

				break;

			case `${commandStates[4]}`:

				if (value === false) {
					value = true;
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ camera ] is being sent with value: ${value}`);

				await axios.post(sendUrl[index], {'camera': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ camera ] command was sent successfully Status: ${result['statusText']}`);

						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ camera ] command: ${error.message}, stack: ${error.stack}`);
					})

				break;

			case `${commandStates[5]}`:


				if (value <= 0) {
					value = 1;
				}
				else if (value >= 255) {
					value = 255
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ brightness ] is being sent with value: ${value}`);

				await axios.post(sendUrl[index], {'brightness': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ brightness ] command was sent successfully Status: ${result['statusText']}`);
							await this.request();
							await this.setState(id, value, true);
						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ brightness ] command: ${error.message}, stack: ${error.stack}`);
					})

				break;

			case `${commandStates[6]}`:

				if (value >= 100) {
					value = 100;
				}
				else if (value <= 0) {
					value = 0;
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ volume ] is being sent with value: ${value}`);

				await axios.post(sendUrl[index], {'volume': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ volume ] command was sent successfully Status: ${result['statusText']}`);
							await this.setState(id, value, true);
						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ volume ] command: ${error.message}, stack: ${error.stack}`);
					})

				break;

			case `${commandStates[7]}`:

				if (value === 0) {
					value = 1;
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ url ] is being sent with value: ${value}`);

				await axios.post(sendUrl[index], {'url': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ url ] command was sent successfully Status: ${result['statusText']}`);
							await this.setState(id, '', true);
						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ url ] command: ${error.message}, stack: ${error.stack}`);
					})

				break;

			case `${commandStates[8]}`:

				if (value === 0) {
					value = 1;
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ urlAudio ] is being sent with value: ${value}`);

				await axios.post(sendUrl[index], {'audio': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ urlAudio ] command was sent successfully Status: ${result['statusText']}`);
							await this.setState(id, '', true);

						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ urlAudio ] command: ${error.message}, stack: ${error.stack}`);
					})

				break;

			case `${commandStates[9]}`:

				if (value === 0) {
					value = 1;
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ speak ] is being sent with value: ${value}`);

				await axios.post(sendUrl[index], {'speak': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ speak ] command was sent successfully Status: ${result['statusText']}`);
							await this.setState(id, '', true);

						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ speak ] command: ${error.message}, stack: ${error.stack}`);
					})

				break;

			case `${commandStates[10]}`:

				if (value === 0) {
					value = 1;
				}
				else {
					value = state.val;
				}

				this.log.debug(`command [ eval ] is being sent with value: ${value}`);

				await axios.post(sendUrl[index], {'eval': value})
					.then(async result => {
						if (result['status'] === 200) {

							this.log.debug(`[ eval ] command was sent successfully Status: ${result['statusText']}`);
							await this.setState(id, '', true);

						}
					}).catch(async error => {
						this.log.error(`sendCommand has a problem sending [ eval ] command: ${error.message}, stack: ${error.stack}`);
					})

				break;

		}

	}


	async create_State(res) {
		try {

			for (const i in deviceEnabled) {
				if (deviceEnabled[i]) {

					this.log.debug(`preparation for the statesCreate...`);

					const requestStatesType = [];

					const requestStates = Object.keys(res['data']);

					this.log.debug(`Read the state name from the apiResult: ${requestStates}`);

					for (const t in requestStates) {
						requestStatesType[t] = typeof Object.values(res['data'])[t];
					}
					this.log.debug(`Read the state Type from the apiResult: ${requestStatesType}`);


					this.log.debug(`Start the stateCreate for the requestStates`);
					this.log.debug(`Start the stateCreate for the commandStates and subscribeStates`);

					await this.extendObjectAsync(`${tabletName[i]}`, {
						type: 'device',
						common: {
							name: ip[i]
						},
						native: {
							ip: ip[i]
						}
					});

					for (const f in folder) {

						await this.extendObjectAsync(`${tabletName[i]}.${folder[f]}`, {
							type: 'channel',
							common: {
								name: `${folder[f]}`
							},
							native: {}
						});

					}

					for (const obj in commandObjects) {

						await this.extendObjectAsync(`${tabletName[i]}.command.${obj}`, commandObjects[obj]);
						this.subscribeStates(`${tabletName[i]}.command.${obj}`);

					}

					for (const obj in infoObjects) {

						await this.extendObjectAsync(`${tabletName[i]}.${obj}`, infoObjects[obj]);

					}

					for (const r in requestStates) {

						await this.extendObjectAsync(`${tabletName[i]}.${requestStates[r]}`, {
							type: 'state',
							common: {
								name: `${requestStates[r]}`,
								type: requestStatesType[r],
								role: `state`,
								read: true,
								write: false
							},
							native: {}
						});
					}

					this.log.debug(`subscribe to all stats in the command folder for ${tabletName[i]}`);

				}
				else {
					this.log.debug(`The ${tabletName[i]} is switched off and no states are created`);
				}
			}
		}
		catch (error) {
			this.log.error(`stateCreate has a problem: ${error.message}, stack: ${error.stack}`);
		}
	}

	/**
	 * Replaces text in a string, using an object that supports replacement within a string.
	 * @param {string} str
	 */
	async replaceFunction(str) {
		if (str) {
			str = str.replace(/ü/g, 'ue');
			str = str.replace(/Ü/g, 'Ue');
			str = str.replace(/ö/g, 'oe');
			str = str.replace(/Ö/g, 'Oe');
			str = str.replace(/Ä/g, 'Ae');
			str = str.replace(/ä/g, 'ae');
			str = str.replace(/\.*\./gi, '_');
			str = str.replace(/ /gi, '_');
			str = str.toLowerCase();
			return str;
		}
	}


	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active

			if (requestTimeout) clearTimeout(requestTimeout);

			for (const Unl in tabletName) {
				if (logMessageTimer[Unl]) clearTimeout(logMessageTimer[Unl]);
				this.setState(`${tabletName[Unl]}.isWallpanelAlive`, {val: false, ack: true});

			}
			this.log.debug(`set isWallpanelAlive to false for all tablets because the adapter is off`);
			this.log.debug(`All timers are canceled because the adapter has been switched off`);

			this.setState('info.connection', false, true);

			callback();
		}
		catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		try {

			if (state) {
				// The state was changed

				for (const change in tabletName) {

					if (deviceEnabled[change] && !state.ack) {

						for (const i in commandStates) {

							if (id === `${this.namespace}.${tabletName[change]}.command.${commandStates[i]}`) {

								this.log.debug(`state ${id} changed: ${state.val} from: ${this.namespace}`);

								this.sendCommand(id, state, change, commandStates[i]);

								break;
							}
						}
					}
				}
			}
			else {
				// The state was deleted
				this.log.debug(`state ${id} deleted`);
			}
		}
		catch (error) {
			this.log.error(`[onStateChane ${id}] error: ${error.message}, stack: ${error.stack}`);
		}
	}
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Wallpanel(options);
}
else {
	// otherwise start the instance directly
	new Wallpanel();
}