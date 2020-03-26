"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var fern_png_1 = __importDefault(require("../images/fern.png"));
require("../styles/App.css");
var TaskList_1 = __importDefault(require("./TaskList"));
// Temporary valuesc
var item_descriptions = [
    'Delete a task by clicking the X button',
    'Edit a task by clicking the \u270e button',
    'Click Enter after editing to save your changes',
];
var items = item_descriptions.map(function (item, index) { return ({
    id: index,
    value: item,
    isBeingEdited: false,
    currentValue: item,
}); });
function App() {
    return ( // TODO: Add links
    react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement("header", { className: "App-header" },
            react_1.default.createElement("img", { src: fern_png_1.default, className: "App-logo", alt: "logo" }),
            react_1.default.createElement("p", null, "Welcome to Spring."),
            react_1.default.createElement("p", null, "Your to-do list can be found below.")),
        react_1.default.createElement(TaskList_1.default, { items: items })));
}
exports.default = App;
//# sourceMappingURL=App.js.map