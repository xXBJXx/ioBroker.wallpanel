"use strict";
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
var replaceFunktion_exports = {};
__export(replaceFunktion_exports, {
  replaceFunktion: () => replaceFunktion
});
module.exports = __toCommonJS(replaceFunktion_exports);
async function replaceFunktion(text) {
  let text2 = text.toLowerCase();
  const replaceArray = [
    { search: "\xE4", replace: "ae" },
    { search: "\xF6", replace: "oe" },
    { search: "\xFC", replace: "ue" },
    { search: "\xDF", replace: "ss" },
    { search: "[^a-z0-9]", replace: "_" }
  ];
  for (const replace of replaceArray) {
    text2 = text2.replace(new RegExp(replace.search, "gu"), replace.replace);
  }
  return text2;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  replaceFunktion
});
//# sourceMappingURL=replaceFunktion.js.map
