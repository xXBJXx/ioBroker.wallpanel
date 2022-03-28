var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_axios = __toESM(require("axios"));
var import_object_definition = __toESM(require("./lib/object_definition"));
var import_replaceFunktion = require("./lib/replaceFunktion");
const commandObjects = import_object_definition.default.object_command_definitions;
const infoObjects = import_object_definition.default.object_info_definitions;
const batteryObjects = import_object_definition.default.object_mqttBattery_definitions;
const lightObjects = import_object_definition.default.object_mqttLight_definitions;
const magneticFieldObjects = import_object_definition.default.object_mqttMagneticField_definitions;
const pressureObjects = import_object_definition.default.object_mqttPressure_definitions;
const temperatureObjects = import_object_definition.default.object_mqttTemperature_definitions;
const motionObjects = import_object_definition.default.object_mqttMotion_definitions;
const faceObjects = import_object_definition.default.object_mqttFace_definitions;
const qrcodeObjects = import_object_definition.default.object_mqttQrcode_definitions;
let requestTimeout = null;
let interval = 30;
let mqttEnabled = false;
let mqttInstance = null;
const mqttPath = [];
let mqttObj = [];
const ip = [];
const device_ip = [];
const port = [];
const tabletName = [];
const requestUrl = [];
const sendUrl = [];
const logMessage = [];
const deviceEnabled = [];
const logMessageTimer = [];
const folder = [`command`];
const commandRequestTimeout = [];
const commandStates = [`clearCache`, `relaunch`, `reload`, `wake`, `camera`, `brightness`, `volume`, `url`, `urlAudio`, `speak`, `eval`];
class Wallpanel extends utils.Adapter {
  constructor(options = {}) {
    super(__spreadProps(__spreadValues({}, options), {
      name: "wallpanel"
    }));
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.setState("info.connection", false, true);
    await this.initialization();
    await this.request();
  }
  async initialization() {
    try {
      this.log.debug(`prepare adapter for initialization`);
      interval = this.config.interval * 1e3;
      if (interval < 1e4) {
        interval = 1e4;
      }
      this.log.debug(`Adapter config for interval readout --> ${interval} ms`);
      const devices = this.config.devices;
      if (!devices && devices["length"] !== 0 || devices !== [] && devices["length"] !== 0) {
        for (const i in devices) {
          device_ip[i] = devices[i]["ip"];
          port[i] = devices[i]["port"];
          deviceEnabled[i] = devices[i]["enabled"];
          mqttEnabled = JSON.parse(this.config["enabledMqtt"]);
          mqttInstance = this.config["mqttInstance"];
          mqttPath[i] = `${mqttInstance}.${devices[i]["baseTopic"].replace("/", ".")}`;
          const Name = devices[i]["name"];
          this.log.debug(`initialization Ip: ${ip[i]}`);
          this.log.debug(`initialization port: ${port[i]}`);
          this.log.debug(`initialization deviceEnabled: ${deviceEnabled[i]}`);
          this.log.debug(`initialization tabletName: ${Name}`);
          for (const mqttPathKey in mqttPath) {
            this.subscribeForeignStates(`${mqttPath[mqttPathKey]}.sensor.motion`);
          }
          this.log.debug(`Check whether the IP address is available for the ${Name}`);
          deviceEnabled[i] = device_ip[i] !== "" && deviceEnabled[i];
          if (device_ip[i] === "")
            this.log.warn(`${Name} has no ip address device is not queried`);
          if (device_ip[i] !== void 0 || device_ip[i] !== "") {
            const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;
            if (device_ip[i].match(ipformat)) {
              ip[i] = device_ip[i];
            } else {
              this.log.warn("No Permitted Ip Address");
              deviceEnabled[i] = false;
            }
          }
          requestUrl[i] = `http://${ip[i]}:${port[i]}/api/state`;
          sendUrl[i] = `http://${ip[i]}:${port[i]}/api/command`;
          this.log.debug(`initialization requestUrl: ${requestUrl[i]}`);
          this.log.debug(`initialization sendUrl: ${sendUrl[i]}`);
          this.log.debug(`it is checked whether the name of the device is entered`);
          if (Name !== "") {
            this.log.debug(`the name of the device is entered and is used --> ${Name}`);
            tabletName[i] = await (0, import_replaceFunktion.replaceFunktion)(Name);
          } else if (deviceEnabled[i]) {
            this.log.debug(`The name of the device is not entered; the IP address is used for the name --> ${ip[i]}`);
            tabletName[i] = await (0, import_replaceFunktion.replaceFunktion)(ip[i]);
          }
          this.log.debug(`Tablet name is being prepared: ${tabletName[i]}`);
        }
        this.setState("info.connection", true, true);
        this.log.debug(`Adapter has been fully initialized`);
      } else {
        deviceEnabled[1] = false;
      }
    } catch (error) {
      this.setState("info.connection", false, true);
      this.log.error(`initialization has a problem: ${error.message}, stack: ${error.stack}`);
    }
  }
  async request() {
    try {
      if (requestTimeout)
        clearTimeout(requestTimeout);
      if (!requestUrl && requestUrl["length"] !== 0 || requestUrl !== [] && requestUrl["length"] !== 0) {
        for (const i in requestUrl) {
          if (deviceEnabled[i]) {
            this.log.debug(`device: ${tabletName[i]} enabled`);
            this.log.debug(`API request started ...`);
            await import_axios.default.get(requestUrl[i]).then(async (apiResult) => {
              if (apiResult["status"] === 200) {
                this.log.debug(`API request ended successfully --> result from api Request: ${JSON.stringify(apiResult["data"])}`);
                if (mqttEnabled) {
                  this.log.debug(`get the MQTT states`);
                  await this.mqttRequest(parseInt(i));
                  this.log.debug(`MQTT states were obtained`);
                }
                this.log.debug(`State Create is now running ...`);
                await this.create_State(apiResult, parseInt(i));
                this.log.debug(`State Create was carried out`);
                this.log.debug(`States are now written`);
                await this.state_write(apiResult, parseInt(i));
                this.setState(`${tabletName[i]}.lastInfoUpdate`, { val: Date.now(), ack: true });
                this.log.debug(`The last update of the state was on: ${Date.now()}`);
                if (logMessageTimer[i])
                  clearTimeout(logMessageTimer[i]);
                this.log.debug(`logMessageTimer for ${tabletName[i]} will be deleted`);
                logMessage[i] = false;
                this.log.debug(`logMessage set to ${logMessage[i]} for ${tabletName[i]}`);
              }
            }).catch(async (error) => {
              if (!logMessage[i]) {
                logMessage[i] = true;
                this.log.debug(`logMessage set to ${logMessage[i]} for ${tabletName[i]}`);
                this.log.error(`[Request] ${tabletName[i]} Unable to contact: ${error} | ${error}`);
              } else if (!logMessageTimer[i]) {
                if (logMessageTimer[i])
                  clearTimeout(logMessageTimer[i]);
                this.log.debug(`logMessageTimer for ${tabletName[i]} will be deleted`);
                this.log.debug(`set logMessageTimer for ${tabletName[i]} to ${36e5 / 6e4} min`);
                logMessageTimer[i] = setTimeout(async () => {
                  logMessage[i] = false;
                  this.log.debug(`logMessage set to ${logMessage[i]} for ${tabletName[i]}`);
                }, 36e5);
              }
            });
          }
        }
        this.log.debug(`set requestTimeout to ${interval / 1e3} sec`);
        requestTimeout = setTimeout(async () => {
          this.log.debug(`request is restarted`);
          await this.request();
        }, interval);
      }
    } catch (error) {
      this.log.error(`[Request function] has a problem: ${error.message}, stack: ${error.stack}`);
    }
  }
  async mqttRequest(index) {
    mqttObj = [];
    const mqttBattery = await this.getForeignStateAsync(`${mqttPath[index]}.sensor.battery`);
    if (mqttBattery !== null && mqttBattery !== void 0) {
      if (typeof mqttBattery.val === "string") {
        mqttObj.push({ battery: JSON.parse(mqttBattery.val) });
      }
    }
    const mqttLight = await this.getForeignStateAsync(`${mqttPath[index]}.sensor.light`);
    if (mqttLight !== null && mqttLight !== void 0) {
      if (typeof mqttLight.val === "string") {
        mqttObj.push({ light: JSON.parse(mqttLight.val) });
      }
    }
    const mqttMotion = await this.getForeignStateAsync(`${mqttPath[index]}.sensor.motion`);
    if (mqttMotion !== null && mqttMotion !== void 0) {
      if (typeof mqttMotion.val === "string") {
        mqttObj.push({ motion: JSON.parse(mqttMotion.val) });
      }
    }
    const mqttFace = await this.getForeignStateAsync(`${mqttPath[index]}.sensor.face`);
    if (mqttFace !== null && mqttFace !== void 0) {
      if (typeof mqttFace.val === "string") {
        mqttObj.push({ face: JSON.parse(mqttFace.val) });
      }
    }
    const mqttQrcode = await this.getForeignStateAsync(`${mqttPath[index]}.sensor.qrcode`);
    if (mqttQrcode !== null && mqttQrcode !== void 0) {
      if (typeof mqttQrcode.val === "string") {
        mqttObj.push({ qrcode: JSON.parse(mqttQrcode.val) });
      }
    }
    const mqttMagneticField = await this.getForeignStateAsync(`${mqttPath[index]}.sensor.magneticField`);
    if (mqttMagneticField !== null && mqttMagneticField !== void 0) {
      if (typeof mqttMagneticField.val === "string") {
        mqttObj.push({
          magneticField: JSON.parse(mqttMagneticField.val)
        });
      }
    }
    const mqttPressure = await this.getForeignStateAsync(`${mqttPath[index]}.sensor.pressure`);
    if (mqttPressure !== null && mqttPressure !== void 0) {
      if (typeof mqttPressure.val === "string") {
        mqttObj.push({ pressure: JSON.parse(mqttPressure.val) });
      }
    }
    const mqttTemperature = await this.getForeignStateAsync(`${mqttPath[index]}.sensor.temperature`);
    if (mqttTemperature !== null && mqttTemperature !== void 0) {
      if (typeof mqttTemperature.val === "string") {
        mqttObj.push({ temperature: JSON.parse(mqttTemperature.val) });
      }
    }
  }
  async state_write(res, index) {
    try {
      this.log.debug(`Preparation for the state write....`);
      this.log.debug(`stats are written now`);
      for (const Key in res.data) {
        await this.setStateAsync(`${tabletName[index]}.${Key}`, {
          val: res.data[Key],
          ack: true
        });
      }
      await this.setStateAsync(`${tabletName[index]}.${Object.keys(infoObjects)[1]}`, {
        val: ip[index],
        ack: true
      });
      if (mqttEnabled) {
        for (const mqttObjKey in mqttObj) {
          const Obj = Object.keys(mqttObj[mqttObjKey]);
          if (Obj[0] === "battery") {
            await this.setStateAsync(`${tabletName[index]}.sensor.battery.battery`, {
              val: mqttObj[mqttObjKey].battery.value,
              ack: true
            });
            await this.setStateAsync(`${tabletName[index]}.sensor.battery.charging`, {
              val: mqttObj[mqttObjKey].battery.charging,
              ack: true
            });
            await this.setStateAsync(`${tabletName[index]}.sensor.battery.acPlugged`, {
              val: mqttObj[mqttObjKey].battery.acPlugged,
              ack: true
            });
            await this.setStateAsync(`${tabletName[index]}.sensor.battery.usbPlugged`, {
              val: mqttObj[mqttObjKey].battery.usbPlugged,
              ack: true
            });
          } else if (Obj[0] === "light") {
            await this.setStateAsync(`${tabletName[index]}.sensor.light.light`, {
              val: mqttObj[mqttObjKey].light.value,
              ack: true
            });
            await this.setStateAsync(`${tabletName[index]}.sensor.light.id`, {
              val: mqttObj[mqttObjKey].light.id,
              ack: true
            });
          } else if (Obj[0] === "magneticField") {
            await this.setStateAsync(`${tabletName[index]}.sensor.magneticField.magneticField`, {
              val: mqttObj[mqttObjKey].magneticField.value,
              ack: true
            });
          } else if (Obj[0] === "pressure") {
            await this.setStateAsync(`${tabletName[index]}.sensor.pressure.pressure`, {
              val: mqttObj[mqttObjKey].pressure.value,
              ack: true
            });
          } else if (Obj[0] === "temperature") {
            await this.setStateAsync(`${tabletName[index]}.sensor.temperature.temperature`, {
              val: mqttObj[mqttObjKey].temperature.value,
              ack: true
            });
          } else if (Obj[0] === "motion") {
            await this.setStateAsync(`${tabletName[index]}.sensor.motion.motion`, {
              val: mqttObj[mqttObjKey].motion.value,
              ack: true
            });
          } else if (Obj[0] === "face") {
            await this.setStateAsync(`${tabletName[index]}.sensor.face.face`, {
              val: mqttObj[mqttObjKey].face.value,
              ack: true
            });
          } else if (Obj[0] === "qrcode") {
            await this.setStateAsync(`${tabletName[index]}.sensor.qrcode.qrcode`, {
              val: mqttObj[mqttObjKey].qrcode.value,
              ack: true
            });
          }
        }
      }
    } catch (error) {
      this.log.error(`state_write has a problem: ${error.message}, stack: ${error.stack}`);
    }
  }
  async sendCommand(id, state, index, cmd) {
    let value = state.val;
    switch (cmd) {
      case `${commandStates[0]}`:
        if (value === false) {
          value = true;
        } else {
          value = state.val;
        }
        this.log.debug(`command [clearCache] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { clearCache: value }).then(async (result) => {
          if (result["status"] === 200) {
            this.log.debug(`[clearCache] command was sent successfully Status: ${result["statusText"]}`);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [clearCache] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[1]}`:
        if (value === false) {
          value = true;
        } else {
          value = state.val;
        }
        this.log.debug(`command [relaunch] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { relaunch: value }).then(async (result) => {
          if (result["status"] === 200) {
            this.log.debug(`[relaunch] command was sent successfully Status: ${result["statusText"]}`);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [relaunch] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[2]}`:
        if (value === false) {
          value = true;
        } else {
          value = state.val;
        }
        this.log.debug(`command [reload] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { reload: value }).then(async (result) => {
          if (result["status"] === 200) {
            this.log.debug(`[reload] command was sent successfully Status: ${result["statusText"]}`);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [reload] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[3]}`:
        this.log.debug(`command [wake] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { wake: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (commandRequestTimeout[index])
              clearTimeout(commandRequestTimeout[index]);
            this.log.debug(`[wake] command was sent successfully Status: ${result["statusText"]}`);
            commandRequestTimeout[index] = setTimeout(async () => {
              await this.request();
            }, 1500);
            await this.setState(id, value, true);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [wake] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[4]}`:
        if (value === false) {
          value = true;
        } else {
          value = state.val;
        }
        this.log.debug(`command [ camera ] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { camera: value }).then(async (result) => {
          if (result["status"] === 200) {
            this.log.debug(`[camera] command was sent successfully Status: ${result["statusText"]}`);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [camera] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[5]}`:
        if (value !== null) {
          if (value <= 0) {
            value = 1;
          } else if (value >= 255) {
            value = 255;
          } else {
            value = state.val;
          }
        } else {
          value = 0;
          if (value <= 0) {
            value = 1;
          } else if (value >= 255) {
            value = 255;
          } else {
            value = state.val;
          }
        }
        this.log.debug(`command [brightness] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { brightness: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (commandRequestTimeout[index])
              clearTimeout(commandRequestTimeout[index]);
            this.log.debug(`[brightness] command was sent successfully Status: ${result["statusText"]}`);
            commandRequestTimeout[index] = setTimeout(async () => {
              await this.request();
            }, 1500);
            await this.setStateAsync(id, value, true);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [brightness] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[6]}`:
        if (value !== null) {
          if (value >= 100) {
            value = 100;
          } else if (value <= 0) {
            value = 0;
          } else {
            value = state.val;
          }
        } else {
          value = 100;
          if (value >= 100) {
            value = 100;
          } else if (value <= 0) {
            value = 0;
          } else {
            value = state.val;
          }
        }
        this.log.debug(`command [volume] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { volume: value }).then(async (result) => {
          if (result["status"] === 200) {
            this.log.debug(`[volume] command was sent successfully Status: ${result["statusText"]}`);
            await this.setStateAsync(id, value, true);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [volume] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[7]}`:
        if (value === 0) {
          value = 1;
        } else {
          value = state.val;
        }
        this.log.debug(`command [url] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { url: value }).then(async (result) => {
          if (result["status"] === 200) {
            this.log.debug(`[url] command was sent successfully Status: ${result["statusText"]}`);
            await this.setStateAsync(id, "", true);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [url] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[8]}`:
        if (value === 0) {
          value = 1;
        } else {
          value = state.val;
        }
        this.log.debug(`command [urlAudio] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { audio: value }).then(async (result) => {
          if (result["status"] === 200) {
            this.log.debug(`[urlAudio] command was sent successfully Status: ${result["statusText"]}`);
            await this.setStateAsync(id, "", true);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [urlAudio] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[9]}`:
        if (value === 0) {
          value = 1;
        } else {
          value = state.val;
        }
        this.log.debug(`command [speak] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { speak: value }).then(async (result) => {
          if (result["status"] === 200) {
            this.log.debug(`[speak] command was sent successfully Status: ${result["statusText"]}`);
            await this.setStateAsync(id, "", true);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [speak] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[10]}`:
        if (value === 0) {
          value = 1;
        } else {
          value = state.val;
        }
        this.log.debug(`command [eval] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { eval: value }).then(async (result) => {
          if (result["status"] === 200) {
            this.log.debug(`[eval] command was sent successfully Status: ${result["statusText"]}`);
            await this.setStateAsync(id, "", true);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [eval] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
    }
  }
  async create_State(res, index) {
    try {
      this.log.debug(`preparation for the statesCreate...`);
      const requestStatesType = [];
      const requestStates = Object.keys(res["data"]);
      this.log.debug(`Read the state name from the apiResult: ${requestStates}`);
      for (const t in requestStates) {
        requestStatesType[t] = typeof Object.values(res["data"])[t];
      }
      this.log.debug(`Read the state Type from the apiResult: ${requestStatesType}`);
      this.log.debug(`Start the stateCreate for the requestStates`);
      this.log.debug(`Start the stateCreate for the commandStates and subscribeStates`);
      await this.setObjectNotExistsAsync(`${tabletName[index]}`, {
        type: "device",
        common: {
          name: ip[index]
        },
        native: {
          ip: ip[index]
        }
      });
      for (const f in folder) {
        await this.setObjectNotExistsAsync(`${tabletName[index]}.${folder[f]}`, {
          type: "channel",
          common: {
            name: `${folder[f]}`
          },
          native: {}
        });
      }
      for (const obj in commandObjects) {
        await this.setObjectNotExistsAsync(`${tabletName[index]}.command.${obj}`, commandObjects[obj]);
        this.subscribeStates(`${tabletName[index]}.command.${obj}`);
        let Objects = null;
        Objects = await this.getObjectAsync(`${tabletName[index]}.command.${obj}`);
        if (Objects !== null && Objects !== void 0) {
          for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
            if (commandObjects[obj].common[valueKey] !== KeyValue) {
              const common = commandObjects[obj].common;
              await this.extendObjectAsync(`${tabletName[index]}.command.${obj}`, {
                type: "state",
                common
              });
              this.log.info(`the state ${Objects._id} has a wrong object structure and was adapted to the new one`);
            }
          }
        }
      }
      for (const obj in infoObjects) {
        await this.setObjectNotExistsAsync(`${tabletName[index]}.${obj}`, infoObjects[obj]);
        let Objects = null;
        Objects = await this.getObjectAsync(`${tabletName[index]}.${obj}`);
        if (Objects !== null && Objects !== void 0) {
          for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
            if (infoObjects[obj].common[valueKey] !== KeyValue) {
              const common = infoObjects[obj].common;
              await this.extendObjectAsync(`${tabletName[index]}.${obj}`, {
                type: "state",
                common
              });
              this.log.info(`the state ${Objects._id} has a wrong object structure and was adapted to the new one`);
            }
          }
        }
      }
      if (mqttEnabled) {
        await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor`, {
          type: "channel",
          common: {
            name: `Sensor values`
          },
          native: {}
        });
        for (const mqttObjKey in mqttObj) {
          const Obj = Object.keys(mqttObj[mqttObjKey]);
          if (Obj[0] === "battery") {
            await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.battery`, {
              type: "channel",
              common: {
                name: `battery Sensor`
              },
              native: {}
            });
            for (const obj in batteryObjects) {
              await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.battery.${obj}`, batteryObjects[obj]);
              let Objects = null;
              Objects = await this.getObjectAsync(`${tabletName[index]}.sensor.battery.${obj}`);
              if (Objects !== null && Objects !== void 0) {
                for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
                  if (batteryObjects[obj].common[valueKey] !== KeyValue) {
                    const common = batteryObjects[obj].common;
                    await this.extendObjectAsync(`${tabletName[index]}.sensor.battery.${obj}`, {
                      type: "state",
                      common
                    });
                    this.log.info(`the state ${Objects._id} has a wrong object structure and was adapted to the new one`);
                  }
                }
              }
            }
          } else if (Obj[0] === "light") {
            await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.light`, {
              type: "channel",
              common: {
                name: `light Sensor`
              },
              native: {}
            });
            for (const obj in lightObjects) {
              await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.light.${obj}`, lightObjects[obj]);
              let Objects = null;
              Objects = await this.getObjectAsync(`${tabletName[index]}.sensor.light.${obj}`);
              if (Objects !== null && Objects !== void 0) {
                for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
                  if (lightObjects[obj].common[valueKey] !== KeyValue) {
                    const common = lightObjects[obj].common;
                    await this.extendObjectAsync(`${tabletName[index]}.sensor.light.${obj}`, {
                      type: "state",
                      common
                    });
                    this.log.info(`the state ${Objects._id} has a wrong object structure and was adapted to the new one`);
                  }
                }
              }
            }
          } else if (Obj[0] === "magneticField") {
            await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.magneticField`, {
              type: "channel",
              common: {
                name: `magneticField Sensor`
              },
              native: {}
            });
            for (const obj in magneticFieldObjects) {
              await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.magneticField.${obj}`, magneticFieldObjects[obj]);
              let Objects = null;
              Objects = await this.getObjectAsync(`${tabletName[index]}.sensor.magneticField.${obj}`);
              if (Objects !== null && Objects !== void 0) {
                for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
                  if (magneticFieldObjects[obj].common[valueKey] !== KeyValue) {
                    const common = magneticFieldObjects[obj].common;
                    await this.extendObjectAsync(`${tabletName[index]}.sensor.magneticField.${obj}`, {
                      type: "state",
                      common
                    });
                    this.log.info(`the state ${Objects._id} has a wrong object structure and was adapted to the new one`);
                  }
                }
              }
            }
          } else if (Obj[0] === "pressure") {
            await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.pressure`, {
              type: "channel",
              common: {
                name: `pressure Sensor`
              },
              native: {}
            });
            for (const obj in pressureObjects) {
              await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.pressure.${obj}`, pressureObjects[obj]);
              let Objects = null;
              Objects = await this.getObjectAsync(`${tabletName[index]}.sensor.pressure.${obj}`);
              if (Objects !== null && Objects !== void 0) {
                for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
                  if (pressureObjects[obj].common[valueKey] !== KeyValue) {
                    const common = pressureObjects[obj].common;
                    await this.extendObjectAsync(`${tabletName[index]}.sensor.pressure.${obj}`, {
                      type: "state",
                      common
                    });
                    this.log.info(`the state ${Objects._id} has a wrong object structure and was adapted to the new one`);
                  }
                }
              }
            }
          } else if (Obj[0] === "temperature") {
            await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.temperature`, {
              type: "channel",
              common: {
                name: `temperature Sensor`
              },
              native: {}
            });
            for (const obj in temperatureObjects) {
              await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.temperature.${obj}`, temperatureObjects[obj]);
              let Objects = null;
              Objects = await this.getObjectAsync(`${tabletName[index]}.sensor.temperature.${obj}`);
              if (Objects !== null && Objects !== void 0) {
                for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
                  if (temperatureObjects[obj].common[valueKey] !== KeyValue) {
                    const common = temperatureObjects[obj].common;
                    await this.extendObjectAsync(`${tabletName[index]}.sensor.temperature.${obj}`, {
                      type: "state",
                      common
                    });
                    this.log.info(`the state ${Objects._id} has a wrong object structure and was adapted to the new one`);
                  }
                }
              }
            }
          } else if (Obj[0] === "motion") {
            await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.motion`, {
              type: "channel",
              common: {
                name: `motion Sensor`
              },
              native: {}
            });
            for (const obj in motionObjects) {
              await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.motion.${obj}`, motionObjects[obj]);
              let Objects = null;
              Objects = await this.getObjectAsync(`${tabletName[index]}.sensor.motion.${obj}`);
              if (Objects !== null && Objects !== void 0) {
                for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
                  if (motionObjects[obj].common[valueKey] !== KeyValue) {
                    const common = motionObjects[obj].common;
                    await this.extendObjectAsync(`${tabletName[index]}.sensor.motion.${obj}`, {
                      type: "state",
                      common
                    });
                    this.log.info(`the state ${Objects._id} has a wrong object structure and was adapted to the new one`);
                  }
                }
              }
            }
          } else if (Obj[0] === "face") {
            await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.face`, {
              type: "channel",
              common: {
                name: `face Sensor`
              },
              native: {}
            });
            for (const obj in faceObjects) {
              await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.face.${obj}`, faceObjects[obj]);
              let Objects = null;
              Objects = await this.getObjectAsync(`${tabletName[index]}.sensor.face.${obj}`);
              if (Objects !== null && Objects !== void 0) {
                for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
                  if (faceObjects[obj].common[valueKey] !== KeyValue) {
                    const common = faceObjects[obj].common;
                    await this.extendObjectAsync(`${tabletName[index]}.sensor.face.${obj}`, {
                      type: "state",
                      common
                    });
                    this.log.info(`the state ${Objects._id} has a wrong object structure and was adapted to the new one`);
                  }
                }
              }
            }
          } else if (Obj[0] === "qrcode") {
            await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.qrcode`, {
              type: "channel",
              common: {
                name: `qrcode Sensor`
              },
              native: {}
            });
            for (const obj in qrcodeObjects) {
              await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.qrcode.${obj}`, qrcodeObjects[obj]);
              let Objects = null;
              Objects = await this.getObjectAsync(`${tabletName[index]}.sensor.qrcode.${obj}`);
              if (Objects !== null && Objects !== void 0) {
                for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
                  if (qrcodeObjects[obj].common[valueKey] !== KeyValue) {
                    const common = qrcodeObjects[obj].common;
                    await this.extendObjectAsync(`${tabletName[index]}.sensor.qrcode.${obj}`, {
                      type: "state",
                      common
                    });
                    this.log.info(`the state ${Objects._id} has a wrong object structure and was adapted to the new one`);
                  }
                }
              }
            }
          }
        }
      }
      for (const r in requestStates) {
        await this.setObjectNotExistsAsync(`${tabletName[index]}.${requestStates[r]}`, {
          type: "state",
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
      this.log.debug(`subscribe to all stats in the command folder for ${tabletName[index]}`);
    } catch (error) {
      this.log.error(`stateCreate has a problem: ${error.message}, stack: ${error.stack}`);
    }
  }
  onUnload(callback) {
    try {
      if (requestTimeout)
        clearTimeout(requestTimeout);
      for (const Unl in tabletName) {
        if (logMessageTimer[Unl])
          clearTimeout(logMessageTimer[Unl]);
        if (commandRequestTimeout[Unl])
          clearTimeout(commandRequestTimeout[Unl]);
      }
      this.log.debug(`All timers are canceled because the adapter has been switched off`);
      this.setState("info.connection", false, true);
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    try {
      if (state) {
        for (const change in tabletName) {
          if (deviceEnabled[change]) {
            if (state.from === `system.adapter.${mqttInstance}`) {
              this.request();
              this.log.debug(`state ${id} changed: ${state.val} from: ${this.namespace}`);
              break;
            }
          }
        }
        for (const change in tabletName) {
          if (deviceEnabled[change] && !state.ack) {
            for (const i in commandStates) {
              if (id === `${this.namespace}.${tabletName[change]}.command.${commandStates[i]}`) {
                this.log.debug(`state ${id} changed: ${state.val} from: ${this.namespace}`);
                this.sendCommand(id, state, parseInt(change), commandStates[i]);
                break;
              }
            }
          }
        }
      } else {
        this.log.debug(`state ${id} deleted`);
      }
    } catch (error) {
      this.log.error(`[onStateChane ${id}] error: ${error.message}, stack: ${error.stack}`);
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new Wallpanel(options);
} else {
  (() => new Wallpanel())();
}
//# sourceMappingURL=main.js.map
