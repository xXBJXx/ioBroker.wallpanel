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
  text2 = text2.replace(/ä/g, "ae");
  text2 = text2.replace(/ö/g, "oe");
  text2 = text2.replace(/ü/g, "ue");
  text2 = text2.replace(/ß/g, "ss");
  text2 = text2.replace(/[^a-z0-9]/g, "_");
  return text2;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  replaceFunktion
});
//# sourceMappingURL=replaceFunktion.js.map
