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
var import_object_definition = require("./lib/object_definition");
var import_replaceFunktion = require("./lib/replaceFunktion");
const commandObjects = import_object_definition.object_command_definitions;
const infoObjects = import_object_definition.object_info_definitions;
const batteryObjects = import_object_definition.object_mqttBattery_definitions;
const lightObjects = import_object_definition.object_mqttLight_definitions;
const magneticFieldObjects = import_object_definition.object_mqttMagneticField_definitions;
const pressureObjects = import_object_definition.object_mqttPressure_definitions;
const temperatureObjects = import_object_definition.object_mqttTemperature_definitions;
const motionObjects = import_object_definition.object_mqttMotion_definitions;
const faceObjects = import_object_definition.object_mqttFace_definitions;
const qrcodeObjects = import_object_definition.object_mqttQrcode_definitions;
let logLevel = "info";
let requestTimeout = null;
let abortController = null;
let interval = 30;
let mqttInstalled = false;
let mqttEnabled = false;
const tabletMqttEnabled = [];
let mqttInstance = null;
const mqttPath = [];
let mqttObj = [];
const mqttAttribute = [
  "battery",
  "light",
  "motion",
  "face",
  "qrcode",
  "magneticField",
  "pressure",
  "temperature"
];
const ip = [];
const device_ip = [];
const port = [];
const connectionState = [];
const tabletName = [];
const requestUrl = [];
const sendUrl = [];
const logMessage = [];
const deviceEnabled = [];
const logMessageTimer = [];
const folder = [`command`];
const commandRequestTimeout = [];
const commandStates = [
  `clearCache`,
  `relaunch`,
  `reload`,
  `wake`,
  `camera`,
  `brightness`,
  `volume`,
  `url`,
  `urlAudio`,
  `speak`,
  `eval`,
  "settings"
];
const adapterIDs = [];
class Wallpanel extends utils.Adapter {
  constructor(options = {}) {
    super(__spreadProps(__spreadValues({}, options), {
      name: "wallpanel"
    }));
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.on("message", this.onMessage.bind(this));
  }
  async onReady() {
    this.setState("info.connection", false, true);
    await this.initialization();
    await this.request();
  }
  async initialization() {
    try {
      const logLevelObj = await this.getForeignStateAsync(`system.adapter.${this.namespace}.logLevel`);
      if (logLevelObj === void 0) {
        logLevel = "info";
      } else {
        if (logLevelObj !== null) {
          logLevel = logLevelObj.val;
        }
      }
      if (logLevel === "debug")
        this.log.debug(`prepare adapter for initialization`);
      interval = this.config.interval * 1e3;
      if (interval < 1e4) {
        interval = 1e4;
      }
      if (logLevel === "debug")
        this.log.debug(`Adapter config for interval readout --> ${interval} ms`);
      const devices = this.config.devices;
      if (!devices && Array.isArray(devices) && devices["length"] !== 0 || Array.isArray(devices) && devices["length"] !== 0) {
        for (const i in devices) {
          const name = devices[i]["name"];
          device_ip[i] = devices[i]["ip"];
          port[i] = devices[i]["port"];
          deviceEnabled[i] = devices[i]["enabled"];
          mqttInstalled = this.config.mqttInstalled;
          mqttEnabled = this.config.enabledMqtt;
          mqttInstance = this.config.mqttInstance;
          tabletMqttEnabled[i] = devices[i]["mqttEnabled"];
          connectionState[i] = false;
          if (devices[i]["topic"] !== "") {
            mqttPath[i] = `${mqttInstance}.${devices[i]["topic"].replace("/", ".")}`;
          } else {
            mqttPath[i] = "undefined";
          }
          if (logLevel === "debug")
            this.log.debug(`initialization Ip for ${name}: ${ip[i]}`);
          if (logLevel === "debug")
            this.log.debug(`initialization port for ${name}: ${port[i]}`);
          if (logLevel === "debug")
            this.log.debug(`initialization deviceEnabled for ${name}: ${deviceEnabled[i]}`);
          if (logLevel === "debug")
            this.log.debug(`initialization tabletName: ${name}`);
          if (logLevel === "debug")
            this.log.debug(`initialization mqttInstalled: ${mqttInstalled}`);
          if (logLevel === "debug")
            this.log.debug(`initialization mqttEnabled: ${mqttEnabled}`);
          if (logLevel === "debug")
            this.log.debug(`initialization mqttInstance: ${mqttInstance}`);
          if (logLevel === "debug")
            this.log.debug(`initialization mqttPaths for ${name}: ${mqttPath}`);
          if (logLevel === "debug")
            this.log.debug(`initialization tabletMqttEnabled for ${name}: ${tabletMqttEnabled[i]}`);
          for (const mqttPathKey in mqttPath) {
            if (mqttPath[mqttPathKey] !== "undefined" && tabletMqttEnabled[i]) {
              this.subscribeForeignStates(`${mqttPath[mqttPathKey]}.sensor.motion`);
              this.subscribeForeignStates(`${mqttPath[mqttPathKey]}.sensor.face`);
            } else {
              if (logLevel === "debug")
                this.log.debug(`[ mqttSubscribeMotion ] mqtt Topic for ${name} with ip ${device_ip[i]} is not set`);
            }
          }
          if (logLevel === "debug")
            this.log.debug(`Check whether the IP address is available for the ${name}`);
          deviceEnabled[i] = device_ip[i] !== "" && deviceEnabled[i];
          if (device_ip[i] === "")
            this.log.warn(`${name} has no ip address device is not queried`);
          if (device_ip[i] !== void 0 || device_ip[i] !== "") {
            const ipRegex = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?!$)|$)){4}$/;
            if (device_ip[i].match(ipRegex)) {
              ip[i] = device_ip[i];
            } else {
              this.log.warn("No Permitted Ip Address");
              deviceEnabled[i] = false;
            }
          }
          requestUrl[i] = `http://${ip[i]}:${port[i]}/api/state`;
          sendUrl[i] = `http://${ip[i]}:${port[i]}/api/command`;
          if (logLevel === "debug")
            this.log.debug(`initialization requestUrl: ${requestUrl[i]}`);
          if (logLevel === "debug")
            this.log.debug(`initialization sendUrl: ${sendUrl[i]}`);
          if (logLevel === "debug")
            this.log.debug(`it is checked whether the name of the device is entered`);
          if (name !== "") {
            if (logLevel === "debug")
              this.log.debug(`the name of the device is entered and is used --> ${name}`);
            tabletName[i] = await (0, import_replaceFunktion.replaceFunktion)(name);
            adapterIDs[i] = `${this.namespace}.${tabletName[i]}`;
          } else if (deviceEnabled[i]) {
            if (logLevel === "debug")
              this.log.debug(`The name of the device is not entered; the IP address is used for the name --> ${ip[i]}`);
            tabletName[i] = await (0, import_replaceFunktion.replaceFunktion)(ip[i]);
          }
          if (logLevel === "debug")
            this.log.debug(`Tablet name is being prepared: ${tabletName[i]}`);
        }
        this.setState("info.connection", true, true);
        this.log.info(`Adapter has been fully initialized`);
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
      if (!requestUrl && Array.isArray(requestUrl) && requestUrl["length"] !== 0 || Array.isArray(requestUrl) && requestUrl["length"] !== 0) {
        for (const i in requestUrl) {
          if (deviceEnabled[i]) {
            if (logLevel === "debug")
              this.log.debug(`device: ${tabletName[i]} enabled`);
            if (logLevel === "debug")
              this.log.debug(`API request started ...`);
            await import_axios.default.get(requestUrl[i]).then(async (apiResult) => {
              if (apiResult["status"] === 200) {
                if (logLevel === "debug")
                  this.log.debug(`API request ended successfully --> result from api Request: ${JSON.stringify(apiResult["data"])}`);
                if (mqttEnabled && mqttInstalled && tabletMqttEnabled[i]) {
                  if (logLevel === "debug")
                    this.log.debug(`requesting data from mqtt`);
                  await this.mqttRequest(parseInt(i));
                }
                if (logLevel === "debug")
                  this.log.debug(`State Create is now running for ${tabletName[i]} ...`);
                await this.create_State(apiResult, parseInt(i));
                if (logLevel === "debug")
                  this.log.debug(`checking whether all objects are needed`);
                await this.deleteFunction();
                await this.state_write(apiResult, parseInt(i));
                await this.setStateAsync(`${tabletName[i]}.lastInfoUpdate`, {
                  val: Date.now(),
                  ack: true
                });
                if (logLevel === "debug")
                  this.log.debug(`The last update of the state was on: ${Date.now()}`);
                await this.setStateAsync(`${tabletName[i]}.connected`, {
                  val: true,
                  ack: true
                });
                connectionState[i] = true;
                if (logLevel === "debug")
                  this.log.debug(`The connection state was set to true`);
                if (logMessageTimer[i])
                  clearTimeout(logMessageTimer[i]);
                if (logLevel === "debug")
                  this.log.debug(`logMessageTimer for ${tabletName[i]} will be deleted`);
                logMessage[i] = false;
                if (logLevel === "debug")
                  this.log.debug(`logMessage set to ${logMessage[i]} for ${tabletName[i]}`);
              }
            }).catch(async (error) => {
              if (!logMessage[i]) {
                logMessage[i] = true;
                if (logLevel === "debug")
                  this.log.debug(`logMessage set to ${logMessage[i]} for ${tabletName[i]}`);
                this.setState(`${tabletName[i]}.connected`, {
                  val: false,
                  ack: true
                });
                connectionState[i] = false;
                this.log.error(`[Request] ${tabletName[i]} Unable to contact: ${error} | ${error}`);
              } else if (!logMessageTimer[i]) {
                if (logMessageTimer[i])
                  clearTimeout(logMessageTimer[i]);
                if (logLevel === "debug")
                  this.log.debug(`logMessageTimer for ${tabletName[i]} will be deleted`);
                if (logLevel === "debug")
                  this.log.debug(`set logMessageTimer for ${tabletName[i]} to ${36e5 / 6e4} min`);
                logMessageTimer[i] = setTimeout(async () => {
                  logMessage[i] = false;
                  if (logLevel === "debug")
                    this.log.debug(`logMessage set to ${logMessage[i]} for ${tabletName[i]}`);
                }, 36e5);
              }
            });
          } else {
            await this.deleteFunction();
          }
        }
        if (logLevel === "debug")
          this.log.debug(`set requestTimeout to ${interval / 1e3} sec`);
        requestTimeout = setTimeout(async () => {
          if (logLevel === "debug")
            this.log.debug(`request is restarted`);
          await this.request();
        }, interval);
      } else {
        if (logLevel === "debug")
          this.log.debug(`no tablets are configured --> delete function will be started for all objects`);
        await this.deleteFunction();
      }
    } catch (error) {
      this.log.error(`[Request function] has a problem: ${error.message}, stack: ${error.stack}`);
    }
  }
  async mqttRequest(index) {
    mqttObj = [];
    for (const i in mqttAttribute) {
      if (mqttPath[index] !== "undefined") {
        const mqttState = await this.getForeignStateAsync(`${mqttPath[index]}.sensor.${mqttAttribute[i]}`);
        if (mqttState) {
          if (mqttObj) {
            if (typeof mqttState.val === "string") {
              mqttObj.push({
                [`${mqttAttribute[i]}`]: JSON.parse(mqttState.val)
              });
            }
          }
        }
      } else {
        if (logLevel === "debug")
          this.log.debug(`[ mqttRequest ] mqtt Topic for ${tabletName[index]} with ip ${device_ip[index]} is not set`);
      }
    }
    if (logLevel === "debug")
      this.log.debug(`MQTT states were obtained`);
    if (logLevel === "debug")
      this.log.debug(`MQTT states are: ${JSON.stringify(mqttObj)}`);
  }
  async state_write(res, index) {
    try {
      if (logLevel === "debug")
        this.log.debug(`Preparation for the state write for ${tabletName[index]} ....`);
      if (logLevel === "debug")
        this.log.debug(`stats are written now`);
      let mqttJsonObj = {};
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
      await this.setStateAsync(`${tabletName[index]}.${Object.keys(infoObjects)[2]}`, {
        val: `http://${ip[index]}:${port[index]}/camera/stream`,
        ack: true
      });
      for (const mqttObjKey in mqttObj) {
        mqttJsonObj = __spreadProps(__spreadValues({}, mqttJsonObj), {
          [`${Object.keys(mqttObj[mqttObjKey])[0]}`]: mqttObj[mqttObjKey][Object.keys(mqttObj[mqttObjKey])[0]]
        });
      }
      let jsonObj = __spreadValues({
        [`${Object.keys(infoObjects)[0]}`]: Date.now(),
        [`${Object.keys(infoObjects)[1]}`]: ip[index],
        [`${Object.keys(infoObjects)[2]}`]: `http://${ip[index]}:${port[index]}/camera/stream`,
        [`${Object.keys(infoObjects)[3]}`]: connectionState[index]
      }, res.data);
      if (tabletMqttEnabled[index]) {
        jsonObj = __spreadValues(__spreadValues({}, jsonObj), mqttJsonObj);
      }
      if (logLevel === "debug")
        this.log.debug(`JSON object is: ${JSON.stringify(jsonObj)}`);
      await this.setStateAsync(`${tabletName[index]}.${Object.keys(infoObjects)[4]}`, {
        val: JSON.stringify(jsonObj),
        ack: true
      });
      if (mqttEnabled && mqttInstalled && tabletMqttEnabled[index]) {
        if (logLevel === "debug")
          this.log.debug(`MQTT state is written now for ${tabletName[index]} ....`);
        for (const mqttObjKey in mqttObj) {
          for (const mqttAttributeKey of mqttAttribute) {
            if (Object.keys(mqttObj[mqttObjKey]).includes(mqttAttributeKey)) {
              for (const key in Object.keys(mqttObj[mqttObjKey][mqttAttributeKey])) {
                if (Object.keys(mqttObj[mqttObjKey][mqttAttributeKey])[key] !== "unit") {
                  const attribute = Object.keys(mqttObj[mqttObjKey][mqttAttributeKey])[key];
                  const state = Object.keys(mqttObj[mqttObjKey][mqttAttributeKey])[key] === "value" ? Object.keys(mqttObj[mqttObjKey])[0] : Object.keys(mqttObj[mqttObjKey][mqttAttributeKey])[key];
                  const value = mqttObj[mqttObjKey][mqttAttributeKey][attribute];
                  await this.setStateAsync(`${tabletName[index]}.sensor.${mqttAttributeKey}.${state}`, {
                    val: value,
                    ack: true
                  });
                }
              }
            }
          }
        }
        if (logLevel === "debug")
          this.log.debug(`MQTT states were written`);
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
        if (logLevel === "debug")
          this.log.debug(`command [clearCache] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { clearCache: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (logLevel === "debug")
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
        if (logLevel === "debug")
          this.log.debug(`command [relaunch] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { relaunch: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (logLevel === "debug")
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
        if (logLevel === "debug")
          this.log.debug(`command [reload] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { reload: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (logLevel === "debug")
              this.log.debug(`[reload] command was sent successfully Status: ${result["statusText"]}`);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [reload] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[3]}`:
        if (logLevel === "debug")
          this.log.debug(`command [wake] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { wake: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (commandRequestTimeout[index])
              clearTimeout(commandRequestTimeout[index]);
            if (logLevel === "debug")
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
        if (logLevel === "debug")
          this.log.debug(`command [ camera ] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { camera: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (logLevel === "debug")
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
        if (logLevel === "debug")
          this.log.debug(`command [brightness] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { brightness: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (commandRequestTimeout[index])
              clearTimeout(commandRequestTimeout[index]);
            if (logLevel === "debug")
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
        if (logLevel === "debug")
          this.log.debug(`command [volume] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { volume: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (logLevel === "debug")
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
        if (logLevel === "debug")
          this.log.debug(`command [url] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { url: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (logLevel === "debug")
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
        if (logLevel === "debug")
          this.log.debug(`command [urlAudio] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { audio: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (logLevel === "debug")
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
        if (logLevel === "debug")
          this.log.debug(`command [speak] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { speak: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (logLevel === "debug")
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
        if (logLevel === "debug")
          this.log.debug(`command [eval] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { eval: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (logLevel === "debug")
              this.log.debug(`[eval] command was sent successfully Status: ${result["statusText"]}`);
            await this.setStateAsync(id, "", true);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [eval] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      case `${commandStates[11]}`: {
        if (value === false) {
          value = true;
        } else {
          value = state.val;
        }
        if (logLevel === "debug")
          this.log.debug(`command [ settings ] is being sent with value: ${value}`);
        await import_axios.default.post(sendUrl[index], { settings: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (logLevel === "debug")
              this.log.debug(`[ settings ] command was sent successfully Status: ${result["statusText"]}`);
          }
        }).catch(async (error) => {
          this.log.error(`sendCommand has a problem sending [ settings ] command: ${error.message}, stack: ${error.stack}`);
        });
        break;
      }
    }
  }
  async create_State(res, index) {
    try {
      if (logLevel === "debug")
        this.log.debug(`preparation for the statesCreate...`);
      const requestStatesType = [];
      const requestStates = Object.keys(res["data"]);
      if (logLevel === "debug")
        this.log.debug(`Read the state name from the apiResult: ${requestStates}`);
      for (const t in requestStates) {
        requestStatesType[t] = typeof Object.values(res["data"])[t];
      }
      if (logLevel === "debug")
        this.log.debug(`Read the state Type from the apiResult: ${requestStatesType}`);
      if (logLevel === "debug")
        this.log.debug(`Start the stateCreate for the requestStates`);
      if (logLevel === "debug")
        this.log.debug(`Start the stateCreate for the commandStates and subscribeStates`);
      await this.setObjectNotExistsAsync(`${tabletName[index]}`, {
        type: "device",
        common: {
          name: `${this.config.devices[index].name}`
        },
        native: {}
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
      if (mqttEnabled && mqttInstalled) {
        if (mqttPath[index] !== "undefined" && mqttObj.length !== 0) {
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
              for (const key in lightObjects) {
                await this.setObjectNotExistsAsync(`${tabletName[index]}.sensor.light.${key}`, lightObjects[key]);
                let Objects = null;
                Objects = await this.getObjectAsync(`${tabletName[index]}.sensor.light.${key}`);
                if (Objects !== null && Objects !== void 0) {
                  for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
                    if (lightObjects[key].common[valueKey] !== KeyValue) {
                      const common = lightObjects[key].common;
                      await this.extendObjectAsync(`${tabletName[index]}.sensor.light.${key}`, {
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
      if (logLevel === "debug")
        this.log.debug(`subscribe to all stats in the command folder for ${tabletName[index]}`);
      if (logLevel === "debug")
        this.log.debug(`State Create was carried out`);
    } catch (error) {
      this.log.error(`stateCreate has a problem: ${error.message}, stack: ${error.stack}`);
    }
  }
  async deleteFunction() {
    try {
      const tabletDeviceId = [];
      const currentAdapterObjects = await this.getAdapterObjectsAsync();
      for (const currentAdapterObjectsKey in currentAdapterObjects) {
        if (currentAdapterObjects[currentAdapterObjectsKey].type === "device") {
          tabletDeviceId.push(currentAdapterObjects[currentAdapterObjectsKey]._id);
        }
      }
      if (tabletDeviceId.length === 0) {
        if (logLevel === "debug")
          this.log.debug("no tablets found in adapter");
        return;
      }
      const deleteId = [];
      for (const currentIDKey in tabletDeviceId) {
        if (adapterIDs.find((element) => element === tabletDeviceId[currentIDKey])) {
          if (logLevel === "debug")
            this.log.debug(`The device with the name ${tabletDeviceId[currentIDKey]} is already registered`);
        } else {
          deleteId.push(tabletDeviceId[currentIDKey]);
        }
      }
      for (const deleteIdKey in deleteId) {
        if (logLevel === "debug")
          this.log.debug(`delete the device with the ID: ${deleteId[deleteIdKey]}`);
        await this.delObjectAsync(deleteId[deleteIdKey], { recursive: true });
      }
      if (logLevel === "debug")
        this.log.debug("all tablet objects that are no longer needed have been deleted");
    } catch (error) {
      this.log.error(`deleteFunction has a problem: ${error.message}, stack: ${error.stack}`);
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
        if (deviceEnabled[Unl])
          this.setState(`${tabletName[Unl]}.connected`, false, true);
      }
      if (logLevel === "debug")
        this.log.debug(`All timers are canceled because the adapter has been switched off`);
      this.setState("info.connection", false, true);
      callback();
    } catch (e) {
      callback();
    }
  }
  async onStateChange(id, state) {
    try {
      if (state) {
        for (const change in tabletName) {
          if (deviceEnabled[change] && tabletMqttEnabled[change]) {
            if (state.from === `system.adapter.${mqttInstance}`) {
              await this.request();
              if (logLevel === "debug")
                this.log.debug(`state ${id} changed: ${state.val} from: ${this.namespace}`);
              break;
            }
          }
        }
        for (const change in tabletName) {
          if (deviceEnabled[change] && !state.ack) {
            for (const i in commandStates) {
              if (id === `${this.namespace}.${tabletName[change]}.command.${commandStates[i]}`) {
                if (logLevel === "debug")
                  this.log.debug(`state ${id} changed: ${state.val} from: ${this.namespace}`);
                await this.sendCommand(id, state, parseInt(change), commandStates[i]);
                break;
              }
            }
          }
        }
      } else {
        if (logLevel === "debug")
          this.log.debug(`state ${id} deleted`);
      }
    } catch (error) {
      this.log.error(`[onStateChane ${id}] error: ${error.message}, stack: ${error.stack}`);
    }
  }
  async onMessage(obj) {
    try {
      if (typeof obj === "object" && obj.message) {
        if (obj.command === "add" || obj.command === "edit") {
          const deviceObj = obj.message;
          abortController = new AbortController();
          await import_axios.default.get(`http://${deviceObj.ip}:${deviceObj.port}/api/state`, {
            timeout: 15e3,
            timeoutErrorMessage: `Device: ${deviceObj.name} with ip: ${deviceObj.ip} takes too long to respond to the request => timeout`,
            signal: abortController.signal
          }).then(async (response) => {
            if (response.status === 200) {
              const deviceOnline = {
                code: 200,
                message: obj.command === "edit" ? `Device: ${deviceObj.name} with ip: ${deviceObj.ip} has been updated` : `Device: ${deviceObj.name} with ip: ${deviceObj.ip} has been added`
              };
              this.sendTo(obj.from, obj.command, deviceOnline, obj.callback);
              if (logLevel === "debug")
                this.log.debug(`Device ${deviceObj.name} with ${deviceObj.ip} added`);
            }
          }).catch((error) => {
            const errorMessage = { code: error.code, message: error.message };
            this.sendTo(obj.from, obj.command, errorMessage, obj.callback);
            if (logLevel === "debug")
              this.log.debug(`[ add New Device request ] error: ${error.message}`);
          });
        }
        if (obj.command === "cancel") {
          if (abortController)
            abortController.abort();
        }
      }
    } catch (error) {
      this.log.error(`[onMessage ${obj.command}] error: ${error.message}, stack: ${error.stack}`);
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new Wallpanel(options);
} else {
  (() => new Wallpanel())();
}
//# sourceMappingURL=main.js.map