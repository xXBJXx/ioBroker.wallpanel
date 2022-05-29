var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var object_definition_exports = {};
__export(object_definition_exports, {
  object_command_definitions: () => object_command_definitions,
  object_info_definitions: () => object_info_definitions,
  object_mqttBattery_definitions: () => object_mqttBattery_definitions,
  object_mqttFace_definitions: () => object_mqttFace_definitions,
  object_mqttLight_definitions: () => object_mqttLight_definitions,
  object_mqttMagneticField_definitions: () => object_mqttMagneticField_definitions,
  object_mqttMotion_definitions: () => object_mqttMotion_definitions,
  object_mqttPressure_definitions: () => object_mqttPressure_definitions,
  object_mqttQrcode_definitions: () => object_mqttQrcode_definitions,
  object_mqttTemperature_definitions: () => object_mqttTemperature_definitions
});
module.exports = __toCommonJS(object_definition_exports);
const object_command_definitions = {
  clearCache: {
    type: "state",
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
  relaunch: {
    type: "state",
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
  reload: {
    type: "state",
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
  wake: {
    type: "state",
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
  camera: {
    type: "state",
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
  brightness: {
    type: "state",
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
  volume: {
    type: "state",
    common: {
      name: `Changes the audio volume`,
      type: `number`,
      role: `level.volume`,
      read: true,
      write: true,
      def: 0,
      unit: "%",
      min: 0,
      max: 100
    },
    native: {}
  },
  url: {
    type: "state",
    common: {
      name: `Browse to a new URL immediately`,
      type: `string`,
      role: `url`,
      def: "",
      read: true,
      write: true
    },
    native: {}
  },
  urlAudio: {
    type: "state",
    common: {
      name: `Play the audio specified by the URL immediately`,
      type: `string`,
      role: `url.audio`,
      def: "",
      read: true,
      write: true
    },
    native: {}
  },
  speak: {
    type: "state",
    common: {
      name: `Uses the devices TTS to speak the message`,
      type: `string`,
      role: `media.tts`,
      def: "",
      read: true,
      write: true
    },
    native: {}
  },
  eval: {
    type: "state",
    common: {
      name: `Evaluates Javascript in the dashboard`,
      type: `string`,
      role: `text`,
      def: "",
      read: true,
      write: true
    },
    native: {}
  },
  settings: {
    type: "state",
    common: {
      name: `Opens the settings screen remotely.`,
      type: `boolean`,
      role: `button`,
      def: true,
      read: true,
      write: true
    },
    native: {}
  }
};
const object_info_definitions = {
  lastInfoUpdate: {
    type: "state",
    common: {
      name: `Last update of the states`,
      type: `number`,
      role: `value.time`,
      def: 0,
      read: true,
      write: false
    },
    native: {}
  },
  ip: {
    type: "state",
    common: {
      name: `Ip address of the device `,
      type: `string`,
      role: `info.ip`,
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  mjpegStream: {
    type: "state",
    common: {
      name: `MJPEG stream`,
      type: `string`,
      role: `media.url`,
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  connected: {
    type: "state",
    common: {
      name: `Is the device connected`,
      type: `boolean`,
      role: `indicator.connected`,
      def: false,
      read: true,
      write: false
    },
    native: {}
  },
  json: {
    type: "state",
    common: {
      name: `all queried data as JSON`,
      type: `string`,
      role: `json`,
      def: "",
      read: true,
      write: false
    },
    native: {}
  }
};
const object_mqttBattery_definitions = {
  battery: {
    type: "state",
    common: {
      name: `battery`,
      type: `number`,
      role: `value.battery`,
      unit: "%",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  },
  acPlugged: {
    type: "state",
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
  usbPlugged: {
    type: "state",
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
  charging: {
    type: "state",
    common: {
      name: `charging`,
      type: `boolean`,
      role: `indicator`,
      def: false,
      read: true,
      write: false
    },
    native: {}
  }
};
const object_mqttLight_definitions = {
  light: {
    type: "state",
    common: {
      name: `light`,
      type: `number`,
      role: `indicator`,
      unit: "lx",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  },
  id: {
    type: "state",
    common: {
      name: `light id`,
      type: `string`,
      role: `text`,
      def: "",
      read: true,
      write: false
    },
    native: {}
  }
};
const object_mqttMagneticField_definitions = {
  magneticField: {
    type: "state",
    common: {
      name: `magneticField`,
      type: `number`,
      role: `indicator`,
      unit: "uT",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  },
  id: {
    type: "state",
    common: {
      name: `magneticField id`,
      type: `string`,
      role: `text`,
      def: "",
      read: true,
      write: false
    },
    native: {}
  }
};
const object_mqttPressure_definitions = {
  pressure: {
    type: "state",
    common: {
      name: `pressure`,
      type: `number`,
      role: `indicator`,
      unit: "hPa",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  }
};
const object_mqttTemperature_definitions = {
  temperature: {
    type: "state",
    common: {
      name: `temperature`,
      type: `number`,
      role: `value.temperature`,
      unit: "\xB0C",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  }
};
const object_mqttMotion_definitions = {
  motion: {
    type: "state",
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
};
const object_mqttFace_definitions = {
  face: {
    type: "state",
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
};
const object_mqttQrcode_definitions = {
  qrcode: {
    type: "state",
    common: {
      name: `QR-Code`,
      type: `string`,
      role: `text`,
      def: "",
      read: true,
      write: false
    },
    native: {}
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  object_command_definitions,
  object_info_definitions,
  object_mqttBattery_definitions,
  object_mqttFace_definitions,
  object_mqttLight_definitions,
  object_mqttMagneticField_definitions,
  object_mqttMotion_definitions,
  object_mqttPressure_definitions,
  object_mqttQrcode_definitions,
  object_mqttTemperature_definitions
});
//# sourceMappingURL=object_definition.js.map
