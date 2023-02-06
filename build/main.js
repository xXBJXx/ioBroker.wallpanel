"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_axios = __toESM(require("axios"));
var import_object_definition = require("./lib/object_definition");
var import_replaceFunktion = require("./lib/replaceFunktion");
var import_source_map_support = __toESM(require("source-map-support"));
import_source_map_support.default.install();
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
class Wallpanel extends utils.Adapter {
  commandRequestTimeout;
  logMessageTimer;
  requestTimeout = null;
  adapterIDs;
  commandStates;
  folder;
  deviceEnabled;
  ip;
  device_ip;
  port;
  connectionState;
  tabletName;
  requestUrl;
  sendUrl;
  logMessage;
  mqttAttribute;
  mqttObj;
  mqttPath;
  mqttInstance;
  tabletMqttEnabled;
  interval;
  mqttInstalled;
  mqttEnabled;
  abortController;
  logLevel;
  constructor(options = {}) {
    super({
      ...options,
      name: "wallpanel"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.abortController = new AbortController();
    this.logLevel = "info";
    this.ip = [];
    this.device_ip = [];
    this.port = [];
    this.connectionState = [];
    this.tabletName = [];
    this.requestUrl = [];
    this.sendUrl = [];
    this.logMessage = [];
    this.adapterIDs = [];
    this.deviceEnabled = [];
    this.folder = [`command`];
    this.commandRequestTimeout = [];
    this.logMessageTimer = [];
    this.requestTimeout = null;
    this.mqttObj = [];
    this.mqttPath = [];
    this.mqttInstance = null;
    this.tabletMqttEnabled = [];
    this.interval = 30;
    this.mqttInstalled = false;
    this.mqttEnabled = false;
    this.commandStates = [
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
    this.mqttAttribute = [
      "battery",
      "light",
      "motion",
      "face",
      "qrcode",
      "magneticField",
      "pressure",
      "temperature"
    ];
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
        this.logLevel = "info";
      } else {
        if (logLevelObj !== null) {
          this.logLevel = logLevelObj.val;
        }
      }
      if (this.logLevel === "debug")
        this.log.debug(`prepare adapter for initialization`);
      this.interval = this.config.interval * 1e3;
      if (this.interval < 1e4) {
        this.interval = 1e4;
      }
      if (this.logLevel === "debug")
        this.log.debug(`Adapter config for interval readout --> ${this.interval} ms`);
      const devices = this.config.devices;
      if (!devices && Array.isArray(devices) && devices["length"] !== 0 || Array.isArray(devices) && devices["length"] !== 0) {
        for (const i in devices) {
          if (devices.hasOwnProperty(i)) {
            const name = devices[i]["name"];
            this.device_ip[i] = devices[i]["ip"];
            this.port[i] = devices[i]["port"];
            this.deviceEnabled[i] = devices[i]["enabled"];
            this.mqttInstalled = this.config.mqttInstalled;
            this.mqttEnabled = this.config.enabledMqtt;
            this.mqttInstance = this.config.mqttInstance;
            this.tabletMqttEnabled[i] = devices[i]["mqttEnabled"];
            this.connectionState[i] = false;
            if (devices[i]["topic"] !== "") {
              this.mqttPath[i] = `${this.mqttInstance}.${devices[i]["topic"].replace(
                "/",
                "."
              )}`;
            } else {
              this.mqttPath[i] = "undefined";
            }
            if (this.logLevel === "debug")
              this.log.debug(`initialization Ip for ${name}: ${this.ip[i]}`);
            if (this.logLevel === "debug")
              this.log.debug(`initialization port for ${name}: ${this.port[i]}`);
            if (this.logLevel === "debug")
              this.log.debug(
                `initialization deviceEnabled for ${name}: ${this.deviceEnabled[i]}`
              );
            if (this.logLevel === "debug")
              this.log.debug(`initialization tabletName: ${name}`);
            if (this.logLevel === "debug")
              this.log.debug(`initialization mqttInstalled: ${this.mqttInstalled}`);
            if (this.logLevel === "debug")
              this.log.debug(`initialization mqttEnabled: ${this.mqttEnabled}`);
            if (this.logLevel === "debug")
              this.log.debug(`initialization mqttInstance: ${this.mqttInstance}`);
            if (this.logLevel === "debug")
              this.log.debug(`initialization mqttPaths for ${name}: ${this.mqttPath}`);
            if (this.logLevel === "debug")
              this.log.debug(
                `initialization tabletMqttEnabled for ${name}: ${this.tabletMqttEnabled[i]}`
              );
            for (const mqttPathKey in this.mqttPath) {
              if (this.mqttPath.hasOwnProperty(mqttPathKey)) {
                if (this.mqttPath[mqttPathKey] !== "undefined" && this.tabletMqttEnabled[i]) {
                  this.subscribeForeignStates(
                    `${this.mqttPath[mqttPathKey]}.sensor.motion`
                  );
                  this.subscribeForeignStates(`${this.mqttPath[mqttPathKey]}.sensor.face`);
                } else {
                  if (this.logLevel === "debug")
                    this.log.debug(
                      `[ mqttSubscribeMotion ] mqtt Topic for ${name} with ip ${this.device_ip[i]} is not set`
                    );
                }
              }
            }
            if (this.logLevel === "debug")
              this.log.debug(`Check whether the IP address is available for the ${name}`);
            this.deviceEnabled[i] = this.device_ip[i] !== "" && this.deviceEnabled[i];
            if (this.device_ip[i] === "")
              this.log.warn(`${name} has no ip address device is not queried`);
            if (this.device_ip[i] !== void 0 || this.device_ip[i] !== "") {
              const ipRegex = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?!$)|$)){4}$/;
              if (this.device_ip[i].match(ipRegex)) {
                this.ip[i] = this.device_ip[i];
              } else {
                this.log.warn("No Permitted Ip Address");
                this.deviceEnabled[i] = false;
              }
            }
            this.requestUrl[i] = `http://${this.ip[i]}:${this.port[i]}/api/state`;
            this.sendUrl[i] = `http://${this.ip[i]}:${this.port[i]}/api/command`;
            if (this.logLevel === "debug")
              this.log.debug(`initialization requestUrl: ${this.requestUrl[i]}`);
            if (this.logLevel === "debug")
              this.log.debug(`initialization sendUrl: ${this.sendUrl[i]}`);
            if (this.logLevel === "debug")
              this.log.debug(`it is checked whether the name of the device is entered`);
            if (name !== "") {
              if (this.logLevel === "debug")
                this.log.debug(`the name of the device is entered and is used --> ${name}`);
              this.tabletName[i] = await (0, import_replaceFunktion.replaceFunktion)(name);
              this.adapterIDs[i] = `${this.namespace}.${this.tabletName[i]}`;
            } else if (this.deviceEnabled[i]) {
              if (this.logLevel === "debug")
                this.log.debug(
                  `The name of the device is not entered; the IP address is used for the name --> ${this.ip[i]}`
                );
              this.tabletName[i] = await (0, import_replaceFunktion.replaceFunktion)(this.ip[i]);
            }
            if (this.logLevel === "debug")
              this.log.debug(`Tablet name is being prepared: ${this.tabletName[i]}`);
          }
        }
        this.setState("info.connection", true, true);
        this.log.info(`Adapter has been fully initialized`);
        this.log.info(`installed Adapter Version ${this.common.version}`);
      } else {
        this.deviceEnabled[1] = false;
      }
    } catch (error) {
      this.setState("info.connection", false, true);
      this.log.error(`initialization has a problem: ${error.message}, stack: ${error.stack}`);
    }
  }
  async request() {
    try {
      if (this.requestTimeout)
        clearTimeout(this.requestTimeout);
      if (!this.requestUrl && Array.isArray(this.requestUrl) && this.requestUrl["length"] !== 0 || Array.isArray(this.requestUrl) && this.requestUrl["length"] !== 0) {
        for (const i in this.requestUrl) {
          if (this.requestUrl.hasOwnProperty(i)) {
            if (this.deviceEnabled[i]) {
              if (this.logLevel === "debug")
                this.log.debug(`device: ${this.tabletName[i]} enabled`);
              if (this.logLevel === "debug")
                this.log.debug(`API request started ...`);
              await import_axios.default.get(this.requestUrl[i]).then(async (apiResult) => {
                if (apiResult["status"] === 200) {
                  if (this.logLevel === "debug")
                    this.log.debug(
                      `API request ended successfully --> result from api Request: ${JSON.stringify(
                        apiResult["data"]
                      )}`
                    );
                  if (this.mqttEnabled && this.mqttInstalled && this.tabletMqttEnabled[i]) {
                    if (this.logLevel === "debug")
                      this.log.debug(`requesting data from mqtt`);
                    await this.mqttRequest(parseInt(i));
                  }
                  if (this.logLevel === "debug")
                    this.log.debug(
                      `State Create is now running for ${this.tabletName[i]} ...`
                    );
                  await this.create_State(apiResult, parseInt(i));
                  if (this.logLevel === "debug")
                    this.log.debug(`checking whether all objects are needed`);
                  await this.deleteFunction();
                  await this.state_write(apiResult, parseInt(i));
                  await this.setStateAsync(`${this.tabletName[i]}.lastInfoUpdate`, {
                    val: Date.now(),
                    ack: true
                  });
                  if (this.logLevel === "debug")
                    this.log.debug(
                      `The last update of the state was on: ${Date.now()}`
                    );
                  await this.setStateAsync(`${this.tabletName[i]}.connected`, {
                    val: true,
                    ack: true
                  });
                  this.connectionState[i] = true;
                  if (this.logLevel === "debug")
                    this.log.debug(`The connection state was set to true`);
                  if (this.logMessageTimer[i])
                    clearTimeout(this.logMessageTimer[i]);
                  if (this.logLevel === "debug")
                    this.log.debug(
                      `logMessageTimer for ${this.tabletName[i]} will be deleted`
                    );
                  this.logMessage[i] = false;
                  if (this.logLevel === "debug")
                    this.log.debug(
                      `logMessage set to ${this.logMessage[i]} for ${this.tabletName[i]}`
                    );
                }
              }).catch(async (error) => {
                if (!this.logMessage[i]) {
                  this.logMessage[i] = true;
                  if (this.logLevel === "debug")
                    this.log.debug(
                      `logMessage set to ${this.logMessage[i]} for ${this.tabletName[i]}`
                    );
                  this.setState(`${this.tabletName[i]}.connected`, {
                    val: false,
                    ack: true
                  });
                  this.connectionState[i] = false;
                  this.log.error(
                    `[Request] ${this.tabletName[i]} Unable to contact: ${error} | ${error}`
                  );
                } else if (!this.logMessageTimer[i]) {
                  if (this.logMessageTimer[i])
                    clearTimeout(this.logMessageTimer[i]);
                  if (this.logLevel === "debug")
                    this.log.debug(
                      `logMessageTimer for ${this.tabletName[i]} will be deleted`
                    );
                  if (this.logLevel === "debug")
                    this.log.debug(
                      `set logMessageTimer for ${this.tabletName[i]} to ${36e5 / 6e4} min`
                    );
                  this.logMessageTimer[i] = setTimeout(async () => {
                    this.logMessage[i] = false;
                    if (this.logLevel === "debug")
                      this.log.debug(
                        `logMessage set to ${this.logMessage[i]} for ${this.tabletName[i]}`
                      );
                  }, 36e5);
                }
              });
            } else {
              await this.deleteFunction();
            }
          }
        }
        if (this.logLevel === "debug")
          this.log.debug(`set requestTimeout to ${this.interval / 1e3} sec`);
        this.requestTimeout = setTimeout(async () => {
          if (this.logLevel === "debug")
            this.log.debug(`request is restarted`);
          await this.request();
        }, this.interval);
      } else {
        if (this.logLevel === "debug")
          this.log.debug(
            `no tablets are configured --> delete function will be started for all objects`
          );
        await this.deleteFunction();
      }
    } catch (error) {
      this.log.error(`[Request function] has a problem: ${error.message}, stack: ${error.stack}`);
    }
  }
  async mqttRequest(index) {
    this.mqttObj = [];
    for (const i in this.mqttAttribute) {
      if (this.mqttAttribute.hasOwnProperty(i)) {
        if (this.mqttPath[index] !== "undefined") {
          const mqttState = await this.getForeignStateAsync(
            `${this.mqttPath[index]}.sensor.${this.mqttAttribute[i]}`
          );
          if (mqttState) {
            if (this.mqttObj) {
              if (typeof mqttState.val === "string") {
                this.mqttObj.push({
                  [`${this.mqttAttribute[i]}`]: JSON.parse(mqttState.val)
                });
              }
            }
          }
        } else {
          if (this.logLevel === "debug")
            this.log.debug(
              `[ mqttRequest ] mqtt Topic for ${this.tabletName[index]} with ip ${this.device_ip[index]} is not set`
            );
        }
      }
    }
    if (this.logLevel === "debug")
      this.log.debug(`MQTT states were obtained`);
    if (this.logLevel === "debug")
      this.log.debug(`MQTT states are: ${JSON.stringify(this.mqttObj)}`);
  }
  async state_write(res, index) {
    try {
      if (this.logLevel === "debug")
        this.log.debug(`Preparation for the state write for ${this.tabletName[index]} ....`);
      if (this.logLevel === "debug")
        this.log.debug(`stats are written now`);
      let mqttJsonObj = {};
      for (const key in res.data) {
        if (res.data.hasOwnProperty(key)) {
          await this.setStateAsync(`${this.tabletName[index]}.${key}`, {
            val: res.data[key],
            ack: true
          });
        }
      }
      await this.setStateAsync(`${this.tabletName[index]}.${Object.keys(infoObjects)[1]}`, {
        val: this.ip[index],
        ack: true
      });
      await this.setStateAsync(`${this.tabletName[index]}.${Object.keys(infoObjects)[2]}`, {
        val: `http://${this.ip[index]}:${this.port[index]}/camera/stream`,
        ack: true
      });
      for (const mqttObjKey in this.mqttObj) {
        if (this.mqttObj.hasOwnProperty(mqttObjKey)) {
          mqttJsonObj = {
            ...mqttJsonObj,
            [`${Object.keys(this.mqttObj[mqttObjKey])[0]}`]: this.mqttObj[mqttObjKey][Object.keys(this.mqttObj[mqttObjKey])[0]]
          };
        }
      }
      let jsonObj = {
        [`${Object.keys(infoObjects)[0]}`]: Date.now(),
        [`${Object.keys(infoObjects)[1]}`]: this.ip[index],
        [`${Object.keys(infoObjects)[2]}`]: `http://${this.ip[index]}:${this.port[index]}/camera/stream`,
        [`${Object.keys(infoObjects)[3]}`]: this.connectionState[index],
        ...res.data
      };
      if (this.tabletMqttEnabled[index]) {
        jsonObj = {
          ...jsonObj,
          ...mqttJsonObj
        };
      }
      if (this.logLevel === "debug")
        this.log.debug(`JSON object is: ${JSON.stringify(jsonObj)}`);
      await this.setStateAsync(`${this.tabletName[index]}.${Object.keys(infoObjects)[4]}`, {
        val: JSON.stringify(jsonObj),
        ack: true
      });
      if (this.mqttEnabled && this.mqttInstalled && this.tabletMqttEnabled[index]) {
        if (this.logLevel === "debug")
          this.log.debug(`MQTT state is written now for ${this.tabletName[index]} ....`);
        for (const mqttObjKey in this.mqttObj) {
          if (this.mqttObj.hasOwnProperty(mqttObjKey)) {
            for (const mqttAttributeKey of this.mqttAttribute) {
              if (Object.keys(this.mqttObj[mqttObjKey]).includes(mqttAttributeKey)) {
                for (const key in Object.keys(this.mqttObj[mqttObjKey][mqttAttributeKey])) {
                  if (Object.keys(
                    this.mqttObj[mqttObjKey][mqttAttributeKey]
                  ).hasOwnProperty(key)) {
                    if (Object.keys(this.mqttObj[mqttObjKey][mqttAttributeKey])[key] !== "unit") {
                      const attribute = Object.keys(
                        this.mqttObj[mqttObjKey][mqttAttributeKey]
                      )[key];
                      const state = Object.keys(this.mqttObj[mqttObjKey][mqttAttributeKey])[key] === "value" ? Object.keys(this.mqttObj[mqttObjKey])[0] : Object.keys(this.mqttObj[mqttObjKey][mqttAttributeKey])[key];
                      const value = this.mqttObj[mqttObjKey][mqttAttributeKey][attribute];
                      await this.setStateAsync(
                        `${this.tabletName[index]}.sensor.${mqttAttributeKey}.${state}`,
                        {
                          val: value,
                          ack: true
                        }
                      );
                    }
                  }
                }
              }
            }
          }
        }
        if (this.logLevel === "debug")
          this.log.debug(`MQTT states were written`);
      }
    } catch (error) {
      this.log.error(`state_write has a problem: ${error.message}, stack: ${error.stack}`);
    }
  }
  async sendCommand(id, state, index, cmd) {
    let value = state.val;
    switch (cmd) {
      case `${this.commandStates[0]}`:
        if (value === false) {
          value = true;
        } else {
          value = state.val;
        }
        if (this.logLevel === "debug")
          this.log.debug(`command [clearCache] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { clearCache: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.logLevel === "debug")
              this.log.debug(
                `[clearCache] command was sent successfully Status: ${result["statusText"]}`
              );
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [clearCache] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[1]}`:
        if (value === false) {
          value = true;
        } else {
          value = state.val;
        }
        if (this.logLevel === "debug")
          this.log.debug(`command [relaunch] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { relaunch: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.logLevel === "debug")
              this.log.debug(
                `[relaunch] command was sent successfully Status: ${result["statusText"]}`
              );
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [relaunch] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[2]}`:
        if (value === false) {
          value = true;
        } else {
          value = state.val;
        }
        if (this.logLevel === "debug")
          this.log.debug(`command [reload] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { reload: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.logLevel === "debug")
              this.log.debug(
                `[reload] command was sent successfully Status: ${result["statusText"]}`
              );
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [reload] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[3]}`:
        if (this.logLevel === "debug")
          this.log.debug(`command [wake] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { wake: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.commandRequestTimeout[index])
              clearTimeout(this.commandRequestTimeout[index]);
            if (this.logLevel === "debug")
              this.log.debug(
                `[wake] command was sent successfully Status: ${result["statusText"]}`
              );
            this.commandRequestTimeout[index] = setTimeout(async () => {
              await this.request();
            }, 1500);
            await this.setState(id, value, true);
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [wake] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[4]}`:
        if (value === false) {
          value = true;
        } else {
          value = state.val;
        }
        if (this.logLevel === "debug")
          this.log.debug(`command [ camera ] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { camera: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.logLevel === "debug")
              this.log.debug(
                `[camera] command was sent successfully Status: ${result["statusText"]}`
              );
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [camera] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[5]}`:
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
        if (this.logLevel === "debug")
          this.log.debug(`command [brightness] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { brightness: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.commandRequestTimeout[index])
              clearTimeout(this.commandRequestTimeout[index]);
            if (this.logLevel === "debug")
              this.log.debug(
                `[brightness] command was sent successfully Status: ${result["statusText"]}`
              );
            this.commandRequestTimeout[index] = setTimeout(async () => {
              await this.request();
            }, 1500);
            await this.setStateAsync(id, value, true);
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [brightness] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[6]}`:
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
        if (this.logLevel === "debug")
          this.log.debug(`command [volume] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { volume: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.logLevel === "debug")
              this.log.debug(
                `[volume] command was sent successfully Status: ${result["statusText"]}`
              );
            await this.setStateAsync(id, value, true);
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [volume] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[7]}`:
        if (value === 0) {
          value = 1;
        } else {
          value = state.val;
        }
        if (this.logLevel === "debug")
          this.log.debug(`command [url] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { url: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.logLevel === "debug")
              this.log.debug(
                `[url] command was sent successfully Status: ${result["statusText"]}`
              );
            await this.setStateAsync(id, "", true);
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [url] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[8]}`:
        if (value === 0) {
          value = 1;
        } else {
          value = state.val;
        }
        if (this.logLevel === "debug")
          this.log.debug(`command [urlAudio] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { audio: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.logLevel === "debug")
              this.log.debug(
                `[urlAudio] command was sent successfully Status: ${result["statusText"]}`
              );
            await this.setStateAsync(id, "", true);
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [urlAudio] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[9]}`:
        if (value === 0) {
          value = 1;
        } else {
          value = state.val;
        }
        if (this.logLevel === "debug")
          this.log.debug(`command [speak] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { speak: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.logLevel === "debug")
              this.log.debug(
                `[speak] command was sent successfully Status: ${result["statusText"]}`
              );
            await this.setStateAsync(id, "", true);
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [speak] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[10]}`:
        if (value === 0) {
          value = 1;
        } else {
          value = state.val;
        }
        if (this.logLevel === "debug")
          this.log.debug(`command [eval] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { eval: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.logLevel === "debug")
              this.log.debug(
                `[eval] command was sent successfully Status: ${result["statusText"]}`
              );
            await this.setStateAsync(id, "", true);
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [eval] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      case `${this.commandStates[11]}`: {
        if (value === false) {
          value = true;
        } else {
          value = state.val;
        }
        if (this.logLevel === "debug")
          this.log.debug(`command [ settings ] is being sent with value: ${value}`);
        await import_axios.default.post(this.sendUrl[index], { settings: value }).then(async (result) => {
          if (result["status"] === 200) {
            if (this.logLevel === "debug")
              this.log.debug(
                `[ settings ] command was sent successfully Status: ${result["statusText"]}`
              );
          }
        }).catch(async (error) => {
          this.log.error(
            `sendCommand has a problem sending [ settings ] command: ${error.message}, stack: ${error.stack}`
          );
        });
        break;
      }
    }
  }
  async create_State(res, index) {
    try {
      if (this.logLevel === "debug")
        this.log.debug(`preparation for the statesCreate...`);
      const requestStatesType = [];
      const requestStates = Object.keys(res["data"]);
      if (this.logLevel === "debug")
        this.log.debug(`Read the state name from the apiResult: ${requestStates}`);
      for (const t in requestStates) {
        if (requestStates.hasOwnProperty(t)) {
          requestStatesType[t] = typeof Object.values(res["data"])[t];
        }
      }
      if (this.logLevel === "debug")
        this.log.debug(`Read the state Type from the apiResult: ${requestStatesType}`);
      if (this.logLevel === "debug")
        this.log.debug(`Start the stateCreate for the requestStates`);
      if (this.logLevel === "debug")
        this.log.debug(`Start the stateCreate for the commandStates and subscribeStates`);
      await this.setObjectNotExistsAsync(`${this.tabletName[index]}`, {
        type: "device",
        common: {
          name: `${this.config.devices[index].name}`
        },
        native: {}
      });
      for (const f in this.folder) {
        if (this.folder.hasOwnProperty(f)) {
          await this.setObjectNotExistsAsync(`${this.tabletName[index]}.${this.folder[f]}`, {
            type: "channel",
            common: {
              name: `${this.folder[f]}`
            },
            native: {}
          });
        }
      }
      for (const obj in commandObjects) {
        if (commandObjects.hasOwnProperty(obj)) {
          await this.setObjectNotExistsAsync(
            `${this.tabletName[index]}.command.${obj}`,
            commandObjects[obj]
          );
          this.subscribeStates(`${this.tabletName[index]}.command.${obj}`);
          let Objects = null;
          Objects = await this.getObjectAsync(`${this.tabletName[index]}.command.${obj}`);
          if (Objects !== null && Objects !== void 0) {
            for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
              if (commandObjects[obj].common[valueKey] !== KeyValue) {
                const common = commandObjects[obj].common;
                await this.extendObjectAsync(`${this.tabletName[index]}.command.${obj}`, {
                  type: "state",
                  common
                });
                this.log.info(
                  `the state ${Objects._id} has a wrong object structure and was adapted to the new one`
                );
              }
            }
          }
        }
      }
      for (const obj in infoObjects) {
        if (infoObjects.hasOwnProperty(obj)) {
          await this.setObjectNotExistsAsync(`${this.tabletName[index]}.${obj}`, infoObjects[obj]);
          let Objects = null;
          Objects = await this.getObjectAsync(`${this.tabletName[index]}.${obj}`);
          if (Objects !== null && Objects !== void 0) {
            for (const [valueKey, KeyValue] of Object.entries(Objects[`common`])) {
              if (infoObjects[obj].common[valueKey] !== KeyValue) {
                const common = infoObjects[obj].common;
                await this.extendObjectAsync(`${this.tabletName[index]}.${obj}`, {
                  type: "state",
                  common
                });
                this.log.info(
                  `the state ${Objects._id} has a wrong object structure and was adapted to the new one`
                );
              }
            }
          }
        }
      }
      if (this.mqttEnabled && this.mqttInstalled) {
        if (this.mqttPath[index] !== "undefined" && this.mqttObj.length !== 0) {
          await this.setObjectNotExistsAsync(`${this.tabletName[index]}.sensor`, {
            type: "channel",
            common: {
              name: `Sensor values`
            },
            native: {}
          });
          for (const mqttObjKey in this.mqttObj) {
            if (this.mqttObj.hasOwnProperty(mqttObjKey)) {
              const Obj = Object.keys(this.mqttObj[mqttObjKey]);
              if (Obj[0] === "battery") {
                await this.setObjectNotExistsAsync(
                  `${this.tabletName[index]}.sensor.battery`,
                  {
                    type: "channel",
                    common: {
                      name: `battery Sensor`
                    },
                    native: {}
                  }
                );
                for (const obj in batteryObjects) {
                  if (batteryObjects.hasOwnProperty(obj)) {
                    await this.setObjectNotExistsAsync(
                      `${this.tabletName[index]}.sensor.battery.${obj}`,
                      batteryObjects[obj]
                    );
                    let Objects = null;
                    Objects = await this.getObjectAsync(
                      `${this.tabletName[index]}.sensor.battery.${obj}`
                    );
                    if (Objects !== null && Objects !== void 0) {
                      for (const [valueKey, KeyValue] of Object.entries(
                        Objects[`common`]
                      )) {
                        if (batteryObjects[obj].common[valueKey] !== KeyValue) {
                          const common = batteryObjects[obj].common;
                          await this.extendObjectAsync(
                            `${this.tabletName[index]}.sensor.battery.${obj}`,
                            {
                              type: "state",
                              common
                            }
                          );
                          this.log.info(
                            `the state ${Objects._id} has a wrong object structure and was adapted to the new one`
                          );
                        }
                      }
                    }
                  }
                }
              } else if (Obj[0] === "light") {
                await this.setObjectNotExistsAsync(`${this.tabletName[index]}.sensor.light`, {
                  type: "channel",
                  common: {
                    name: `light Sensor`
                  },
                  native: {}
                });
                for (const key in lightObjects) {
                  if (lightObjects.hasOwnProperty(key)) {
                    await this.setObjectNotExistsAsync(
                      `${this.tabletName[index]}.sensor.light.${key}`,
                      lightObjects[key]
                    );
                    let Objects = null;
                    Objects = await this.getObjectAsync(
                      `${this.tabletName[index]}.sensor.light.${key}`
                    );
                    if (Objects !== null && Objects !== void 0) {
                      for (const [valueKey, KeyValue] of Object.entries(
                        Objects[`common`]
                      )) {
                        if (lightObjects[key].common[valueKey] !== KeyValue) {
                          const common = lightObjects[key].common;
                          await this.extendObjectAsync(
                            `${this.tabletName[index]}.sensor.light.${key}`,
                            {
                              type: "state",
                              common
                            }
                          );
                          this.log.info(
                            `the state ${Objects._id} has a wrong object structure and was adapted to the new one`
                          );
                        }
                      }
                    }
                  }
                }
              } else if (Obj[0] === "magneticField") {
                await this.setObjectNotExistsAsync(
                  `${this.tabletName[index]}.sensor.magneticField`,
                  {
                    type: "channel",
                    common: {
                      name: `magneticField Sensor`
                    },
                    native: {}
                  }
                );
                for (const obj in magneticFieldObjects) {
                  if (magneticFieldObjects.hasOwnProperty(obj)) {
                    await this.setObjectNotExistsAsync(
                      `${this.tabletName[index]}.sensor.magneticField.${obj}`,
                      magneticFieldObjects[obj]
                    );
                    let Objects = null;
                    Objects = await this.getObjectAsync(
                      `${this.tabletName[index]}.sensor.magneticField.${obj}`
                    );
                    if (Objects !== null && Objects !== void 0) {
                      for (const [valueKey, KeyValue] of Object.entries(
                        Objects[`common`]
                      )) {
                        if (magneticFieldObjects[obj].common[valueKey] !== KeyValue) {
                          const common = magneticFieldObjects[obj].common;
                          await this.extendObjectAsync(
                            `${this.tabletName[index]}.sensor.magneticField.${obj}`,
                            {
                              type: "state",
                              common
                            }
                          );
                          this.log.info(
                            `the state ${Objects._id} has a wrong object structure and was adapted to the new one`
                          );
                        }
                      }
                    }
                  }
                }
              } else if (Obj[0] === "pressure") {
                await this.setObjectNotExistsAsync(
                  `${this.tabletName[index]}.sensor.pressure`,
                  {
                    type: "channel",
                    common: {
                      name: `pressure Sensor`
                    },
                    native: {}
                  }
                );
                for (const obj in pressureObjects) {
                  if (pressureObjects.hasOwnProperty(obj)) {
                    await this.setObjectNotExistsAsync(
                      `${this.tabletName[index]}.sensor.pressure.${obj}`,
                      pressureObjects[obj]
                    );
                    let Objects = null;
                    Objects = await this.getObjectAsync(
                      `${this.tabletName[index]}.sensor.pressure.${obj}`
                    );
                    if (Objects !== null && Objects !== void 0) {
                      for (const [valueKey, KeyValue] of Object.entries(
                        Objects[`common`]
                      )) {
                        if (pressureObjects[obj].common[valueKey] !== KeyValue) {
                          const common = pressureObjects[obj].common;
                          await this.extendObjectAsync(
                            `${this.tabletName[index]}.sensor.pressure.${obj}`,
                            {
                              type: "state",
                              common
                            }
                          );
                          this.log.info(
                            `the state ${Objects._id} has a wrong object structure and was adapted to the new one`
                          );
                        }
                      }
                    }
                  }
                }
              } else if (Obj[0] === "temperature") {
                await this.setObjectNotExistsAsync(
                  `${this.tabletName[index]}.sensor.temperature`,
                  {
                    type: "channel",
                    common: {
                      name: `temperature Sensor`
                    },
                    native: {}
                  }
                );
                for (const obj in temperatureObjects) {
                  if (temperatureObjects.hasOwnProperty(obj)) {
                    await this.setObjectNotExistsAsync(
                      `${this.tabletName[index]}.sensor.temperature.${obj}`,
                      temperatureObjects[obj]
                    );
                    let Objects = null;
                    Objects = await this.getObjectAsync(
                      `${this.tabletName[index]}.sensor.temperature.${obj}`
                    );
                    if (Objects !== null && Objects !== void 0) {
                      for (const [valueKey, KeyValue] of Object.entries(
                        Objects[`common`]
                      )) {
                        if (temperatureObjects[obj].common[valueKey] !== KeyValue) {
                          const common = temperatureObjects[obj].common;
                          await this.extendObjectAsync(
                            `${this.tabletName[index]}.sensor.temperature.${obj}`,
                            {
                              type: "state",
                              common
                            }
                          );
                          this.log.info(
                            `the state ${Objects._id} has a wrong object structure and was adapted to the new one`
                          );
                        }
                      }
                    }
                  }
                }
              } else if (Obj[0] === "motion") {
                await this.setObjectNotExistsAsync(
                  `${this.tabletName[index]}.sensor.motion`,
                  {
                    type: "channel",
                    common: {
                      name: `motion Sensor`
                    },
                    native: {}
                  }
                );
                for (const obj in motionObjects) {
                  if (motionObjects.hasOwnProperty(obj)) {
                    await this.setObjectNotExistsAsync(
                      `${this.tabletName[index]}.sensor.motion.${obj}`,
                      motionObjects[obj]
                    );
                    let Objects = null;
                    Objects = await this.getObjectAsync(
                      `${this.tabletName[index]}.sensor.motion.${obj}`
                    );
                    if (Objects !== null && Objects !== void 0) {
                      for (const [valueKey, KeyValue] of Object.entries(
                        Objects[`common`]
                      )) {
                        if (motionObjects[obj].common[valueKey] !== KeyValue) {
                          const common = motionObjects[obj].common;
                          await this.extendObjectAsync(
                            `${this.tabletName[index]}.sensor.motion.${obj}`,
                            {
                              type: "state",
                              common
                            }
                          );
                          this.log.info(
                            `the state ${Objects._id} has a wrong object structure and was adapted to the new one`
                          );
                        }
                      }
                    }
                  }
                }
              } else if (Obj[0] === "face") {
                await this.setObjectNotExistsAsync(`${this.tabletName[index]}.sensor.face`, {
                  type: "channel",
                  common: {
                    name: `face Sensor`
                  },
                  native: {}
                });
                for (const obj in faceObjects) {
                  if (faceObjects.hasOwnProperty(obj)) {
                    await this.setObjectNotExistsAsync(
                      `${this.tabletName[index]}.sensor.face.${obj}`,
                      faceObjects[obj]
                    );
                    let Objects = null;
                    Objects = await this.getObjectAsync(
                      `${this.tabletName[index]}.sensor.face.${obj}`
                    );
                    if (Objects !== null && Objects !== void 0) {
                      for (const [valueKey, KeyValue] of Object.entries(
                        Objects[`common`]
                      )) {
                        if (faceObjects[obj].common[valueKey] !== KeyValue) {
                          const common = faceObjects[obj].common;
                          await this.extendObjectAsync(
                            `${this.tabletName[index]}.sensor.face.${obj}`,
                            {
                              type: "state",
                              common
                            }
                          );
                          this.log.info(
                            `the state ${Objects._id} has a wrong object structure and was adapted to the new one`
                          );
                        }
                      }
                    }
                  }
                }
              } else if (Obj[0] === "qrcode") {
                await this.setObjectNotExistsAsync(
                  `${this.tabletName[index]}.sensor.qrcode`,
                  {
                    type: "channel",
                    common: {
                      name: `qrcode Sensor`
                    },
                    native: {}
                  }
                );
                for (const obj in qrcodeObjects) {
                  if (qrcodeObjects.hasOwnProperty(obj)) {
                    await this.setObjectNotExistsAsync(
                      `${this.tabletName[index]}.sensor.qrcode.${obj}`,
                      qrcodeObjects[obj]
                    );
                    let Objects = null;
                    Objects = await this.getObjectAsync(
                      `${this.tabletName[index]}.sensor.qrcode.${obj}`
                    );
                    if (Objects !== null && Objects !== void 0) {
                      for (const [valueKey, KeyValue] of Object.entries(
                        Objects[`common`]
                      )) {
                        if (qrcodeObjects[obj].common[valueKey] !== KeyValue) {
                          const common = qrcodeObjects[obj].common;
                          await this.extendObjectAsync(
                            `${this.tabletName[index]}.sensor.qrcode.${obj}`,
                            {
                              type: "state",
                              common
                            }
                          );
                          this.log.info(
                            `the state ${Objects._id} has a wrong object structure and was adapted to the new one`
                          );
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      for (const r in requestStates) {
        if (requestStates.hasOwnProperty(r)) {
          await this.setObjectNotExistsAsync(`${this.tabletName[index]}.${requestStates[r]}`, {
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
      }
      if (this.logLevel === "debug")
        this.log.debug(`subscribe to all stats in the command folder for ${this.tabletName[index]}`);
      if (this.logLevel === "debug")
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
        if (currentAdapterObjects.hasOwnProperty(currentAdapterObjectsKey)) {
          if (currentAdapterObjects[currentAdapterObjectsKey].type === "device") {
            tabletDeviceId.push(currentAdapterObjects[currentAdapterObjectsKey]._id);
          }
        }
      }
      if (tabletDeviceId.length === 0) {
        if (this.logLevel === "debug")
          this.log.debug("no tablets found in adapter");
        return;
      }
      const deleteId = [];
      for (const currentIDKey in tabletDeviceId) {
        if (tabletDeviceId.hasOwnProperty(currentIDKey)) {
          if (this.adapterIDs.find((element) => element === tabletDeviceId[currentIDKey])) {
            if (this.logLevel === "debug")
              this.log.debug(
                `The device with the name ${tabletDeviceId[currentIDKey]} is already registered`
              );
          } else {
            deleteId.push(tabletDeviceId[currentIDKey]);
          }
        }
      }
      for (const deleteIdKey in deleteId) {
        if (deleteId.hasOwnProperty(deleteIdKey)) {
          if (this.logLevel === "debug")
            this.log.debug(`delete the device with the ID: ${deleteId[deleteIdKey]}`);
          await this.delObjectAsync(deleteId[deleteIdKey], { recursive: true });
        }
      }
      if (this.logLevel === "debug")
        this.log.debug("all tablet objects that are no longer needed have been deleted");
    } catch (error) {
      this.log.error(`deleteFunction has a problem: ${error.message}, stack: ${error.stack}`);
    }
  }
  onUnload(callback) {
    try {
      if (this.requestTimeout)
        clearTimeout(this.requestTimeout);
      for (const Unl in this.tabletName) {
        if (this.tabletName.hasOwnProperty(Unl)) {
          if (this.logMessageTimer[Unl])
            clearTimeout(this.logMessageTimer[Unl]);
          if (this.commandRequestTimeout[Unl])
            clearTimeout(this.commandRequestTimeout[Unl]);
          if (this.deviceEnabled[Unl])
            this.setState(`${this.tabletName[Unl]}.connected`, false, true);
        }
      }
      if (this.logLevel === "debug")
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
        for (const change in this.tabletName) {
          if (this.tabletName.hasOwnProperty(change)) {
            if (this.deviceEnabled[change] && this.tabletMqttEnabled[change]) {
              if (state.from === `system.adapter.${this.mqttInstance}`) {
                await this.request();
                if (this.logLevel === "debug")
                  this.log.debug(
                    `state ${id} changed: ${state.val} from: ${this.namespace}`
                  );
                break;
              }
            }
          }
        }
        for (const change in this.tabletName) {
          if (this.tabletName.hasOwnProperty(change)) {
            if (this.deviceEnabled[change] && !state.ack) {
              for (const i in this.commandStates) {
                if (this.commandStates.hasOwnProperty(i)) {
                  if (id === `${this.namespace}.${this.tabletName[change]}.command.${this.commandStates[i]}`) {
                    if (this.logLevel === "debug")
                      this.log.debug(
                        `state ${id} changed: ${state.val} from: ${this.namespace}`
                      );
                    await this.sendCommand(
                      id,
                      state,
                      parseInt(change),
                      this.commandStates[i]
                    );
                    break;
                  }
                }
              }
            }
          }
        }
      } else {
        if (this.logLevel === "debug")
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
          await import_axios.default.get(`http://${deviceObj.ip}:${deviceObj.port}/api/state`, {
            timeout: 15e3,
            timeoutErrorMessage: `Device: ${deviceObj.name} with ip: ${deviceObj.ip} takes too long to respond to the request => timeout`,
            signal: this.abortController.signal
          }).then(async (response) => {
            if (response.status === 200) {
              const deviceOnline = {
                code: 200,
                message: obj.command === "edit" ? `Device: ${deviceObj.name} with ip: ${deviceObj.ip} has been updated` : `Device: ${deviceObj.name} with ip: ${deviceObj.ip} has been added`
              };
              this.sendTo(obj.from, obj.command, deviceOnline, obj.callback);
              if (this.logLevel === "debug")
                this.log.debug(`Device ${deviceObj.name} with ${deviceObj.ip} added`);
            }
          }).catch((error) => {
            const errorMessage = { code: error.code, message: error.message };
            this.sendTo(obj.from, obj.command, errorMessage, obj.callback);
            if (this.logLevel === "debug")
              this.log.debug(`[ add New Device request ] error: ${error.message}`);
          });
        }
        if (obj.command === "cancel") {
          if (this.abortController)
            this.abortController.abort();
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
