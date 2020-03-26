"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
require("../styles/TaskList.scss");
/* ========= ListItem ========== */
var ListItem = function (_a) {
    var value = _a.value, handleChangeEdit = _a.handleChangeEdit, handleSubmitEdit = _a.handleSubmitEdit, onClickEdit = _a.onClickEdit, onClickDelete = _a.onClickDelete;
    var editSymbol = '\u270e'; // Unicode lower right pencil
    var deleteSymbol = 'X';
    var editButtonStyle = value.isBeingEdited ? 'TaskList-listbutton-selected' : 'TaskList-listbutton';
    var elementToDisplay;
    if (value.isBeingEdited) {
        elementToDisplay = (react_1.default.createElement(EditTaskForm, { value: value.currentValue, onChange: handleChangeEdit, onSubmit: handleSubmitEdit }));
    }
    else {
        elementToDisplay = react_1.default.createElement("span", { className: "TaskList-text" }, value.value);
    }
    return (react_1.default.createElement("li", null,
        react_1.default.createElement("span", { className: "TaskList-listitem" },
            react_1.default.createElement("span", { className: "TaskList-listtext" }, elementToDisplay),
            react_1.default.createElement("span", null,
                react_1.default.createElement("button", { className: editButtonStyle, type: "submit", onClick: onClickEdit }, editSymbol),
                react_1.default.createElement("button", { className: "TaskList-listbutton", type: "submit", onClick: onClickDelete }, deleteSymbol)))));
};
ListItem.propTypes = {
    value: prop_types_1.default.shape({
        id: prop_types_1.default.number.isRequired,
        value: prop_types_1.default.string.isRequired,
        isBeingEdited: prop_types_1.default.bool.isRequired,
        currentValue: prop_types_1.default.string.isRequired,
    }).isRequired,
    handleChangeEdit: prop_types_1.default.func.isRequired,
    handleSubmitEdit: prop_types_1.default.func.isRequired,
    onClickEdit: prop_types_1.default.func.isRequired,
    onClickDelete: prop_types_1.default.func.isRequired,
};
/* ========= EditTaskForm ========== */
function getResizeWidth(str) {
    return (str.length > 0 ? str.length : 1) * 0.75 + "em"; // TODO: find a better way to resize
}
var EditTaskForm = function (_a) {
    var value = _a.value, onChange = _a.onChange, onSubmit = _a.onSubmit;
    return (react_1.default.createElement("form", { style: { width: '100%' }, onSubmit: onSubmit },
        react_1.default.createElement("input", { className: "TaskList-forminput", type: "text", value: value, onChange: onChange, style: { width: getResizeWidth(value) } })));
};
EditTaskForm.propTypes = {
    value: prop_types_1.default.string.isRequired,
    onChange: prop_types_1.default.func.isRequired,
    onSubmit: prop_types_1.default.func.isRequired,
};
/* ========= NewTaskForm ========== */
var NewTaskForm = function (_a) {
    var value = _a.value, onSubmit = _a.onSubmit, onChange = _a.onChange;
    return (react_1.default.createElement("form", { className: "TaskList-newform", onSubmit: onSubmit },
        react_1.default.createElement("input", { className: "TaskList-forminput", type: "text", placeholder: "Add a new task", value: value, onChange: onChange, style: { width: getResizeWidth(value) } })));
};
NewTaskForm.propTypes = {
    value: prop_types_1.default.string.isRequired,
    onChange: prop_types_1.default.func.isRequired,
    onSubmit: prop_types_1.default.func.isRequired,
};
/* ========= TaskList ========== */
var TaskList = /** @class */ (function (_super) {
    __extends(TaskList, _super);
    function TaskList(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChangeAdd = function (event) {
            _this.setState({
                formValue: event.target.value,
            });
        };
        _this.defaultFormValue = '';
        _this.state = {
            formValue: _this.defaultFormValue,
            items: JSON.parse(localStorage.getItem('allTasks')) || props.items,
        };
        _this.handleChangeAdd = _this.handleChangeAdd.bind(_this);
        _this.handleSubmitAdd = _this.handleSubmitAdd.bind(_this);
        _this.handleChangeEdit = _this.handleChangeEdit.bind(_this);
        _this.handleSubmitEdit = _this.handleSubmitEdit.bind(_this);
        return _this;
    }
    TaskList.resetItem = function (item) {
        return __assign(__assign({}, item), { isBeingEdited: false, currentValue: item.value });
    };
    TaskList.prototype.saveState = function () {
        var items = this.state.items;
        var resettedItems = items.map(function (item) { return TaskList.resetItem(item); });
        localStorage.setItem('allTasks', JSON.stringify(resettedItems));
    };
    TaskList.prototype.handleSubmitAdd = function (event) {
        var _this = this;
        var _a = this.state, formValue = _a.formValue, items = _a.items;
        var newItem = {
            id: new Date().getTime(),
            value: formValue,
            isBeingEdited: false,
            currentValue: formValue,
        };
        this.setState({
            formValue: this.defaultFormValue,
            items: __spreadArrays(items, [newItem]),
        }, function () { return _this.saveState(); });
        event.preventDefault();
    };
    TaskList.prototype.editItem = function (index, modifier) {
        var _this = this;
        this.setState(function (prevState) {
            var items = prevState.items.slice();
            var oldItem = items[index];
            var newItem = modifier(oldItem);
            items.splice(index, 1, newItem);
            return { items: items };
        }, function () { return _this.saveState(); });
    };
    TaskList.prototype.handleChangeEdit = function (index, event) {
        var value = event.target.value;
        this.editItem(index, function (oldItem) { return (__assign(__assign({}, oldItem), { currentValue: value })); });
    };
    TaskList.prototype.handleSubmitEdit = function (index, event) {
        this.editItem(index, function (oldItem) { return (__assign(__assign({}, oldItem), { isBeingEdited: false, value: oldItem.currentValue })); });
        event.preventDefault();
    };
    TaskList.prototype.toggleEditState = function (index) {
        this.editItem(index, function (oldItem) { return (__assign(__assign({}, oldItem), { isBeingEdited: !oldItem.isBeingEdited })); });
    };
    TaskList.prototype.deleteItem = function (index) {
        var _this = this;
        this.setState(function (prevState) {
            var items = prevState.items.slice();
            items.splice(index, 1);
            return { items: items };
        }, function () { return _this.saveState(); });
    };
    TaskList.prototype.render = function () {
        var _this = this;
        var _a = this.state, items = _a.items, formValue = _a.formValue;
        var listItems = items.map(function (item, index) { return (react_1.default.createElement(ListItem, { key: item.id, value: item, onClickEdit: function () { return _this.toggleEditState(index); }, onClickDelete: function () { return _this.deleteItem(index); }, handleChangeEdit: function (event) { return _this.handleChangeEdit(index, event); }, handleSubmitEdit: function (event) { return _this.handleSubmitEdit(index, event); } })); });
        return (react_1.default.createElement("div", { className: "TaskList" },
            react_1.default.createElement("header", { className: "TaskList-header" }, "My To-Dos"),
            react_1.default.createElement("ol", { className: "TaskList-list" }, listItems),
            react_1.default.createElement(NewTaskForm, { value: formValue, onChange: this.handleChangeAdd, onSubmit: this.handleSubmitAdd })));
    };
    return TaskList;
}(react_1.default.Component));
// @ts-ignore
TaskList.propTypes = {
    items: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        id: prop_types_1.default.number.isRequired,
        value: prop_types_1.default.string.isRequired,
        isBeingEdited: prop_types_1.default.bool.isRequired,
        currentValue: prop_types_1.default.string.isRequired,
    })).isRequired,
};
exports.default = TaskList;
//# sourceMappingURL=TaskList.js.map