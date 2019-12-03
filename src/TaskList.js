import React from 'react';
import PropTypes from 'prop-types';
import './TaskList.scss';

function getResizeWidth(string) {
  return `${string.length * 0.75}em`; // TODO: find a better way to resize
}

function EditTaskForm(props) {
  return (
    <form className="TaskList-editform" onSubmit={props.onSubmit}>
      <input
        className="TaskList-forminput"
        type="text"
        value={props.value}
        onChange={props.onChange}
        style={{ width: getResizeWidth(props.value) }}
      />
    </form>
  );
}

EditTaskForm.propTypes = {
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

function ListItem(props) {
  const editSymbol = '\u270e'; // Unicode lower right pencil
  const deleteSymbol = 'X';
  const editButtonStyle = props.value.isBeingEdited ? 'TaskList-listbutton-selected' : 'TaskList-listbutton';

  let elementToDisplay;
  if (props.value.isBeingEdited) {
    elementToDisplay = <EditTaskForm
      value={props.value.currentValue}
      onChange={props.handleChangeEdit}
      onSubmit={props.handleSubmitEdit}
    />;
  } else {
    elementToDisplay = <span>{props.value.value}</span>;
  }

  return (
    <li>
      <span className="TaskList-listitem">
        {elementToDisplay}
        <span>
          <button className={editButtonStyle} onClick={props.onClickEdit}>
            {editSymbol}
          </button>
          <button className="TaskList-listbutton" onClick={props.onClickDelete}>
            {deleteSymbol}
          </button>
        </span>
      </span>
    </li>
  );
}

function NewTaskForm(props) {
  return (
    <form
      className="TaskList-newform"
      onSubmit={props.onSubmit}
    >
      <input
        className="TaskList-forminput"
        type="text"
        placeholder="Add a new task"
        value={props.value}
        onChange={props.onChange}
        style={{ width: getResizeWidth(props.value) }}
      />
    </form>
  );
}

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.defaultFormValue = '';
    this.state = {
      formValue: TaskList.defaultFormValue,
      items: JSON.parse(localStorage.getItem('allTasks')) || props.items,
    };

    this.handleChangeAdd = this.handleChangeAdd.bind(this);
    this.handleSubmitAdd = this.handleSubmitAdd.bind(this);
    this.handleChangeEdit = this.handleChangeEdit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
  }

  saveState() {
    const items = this.state.items.map((item) => this.resetItem(item));
    localStorage.setItem('allTasks', JSON.stringify(items));
  }

  resetItem(item) {
    return {
      ...item,
      isBeingEdited: false,
      currentValue: item.value,
    };
  }

  handleChangeAdd(event) {
    this.setState({
      formValue: event.target.value,
    });
  }

  handleSubmitAdd(event) {
    const newItem = {
      id: new Date().getTime(),
      value: this.state.formValue,
      isBeingEdited: false,
      currentValue: this.state.formValue,
    };
    this.setState({
      formValue: this.defaultFormValue,
      items: [...this.state.items, newItem],
    }, () => this.saveState());
    event.preventDefault();
  }

  editItem(index, modifier) {
    const items = this.state.items.slice();
    const oldItem = items[index];
    const newItem = modifier(oldItem);
    items.splice(index, 1, newItem);
    this.setState({
      items,
    }, () => this.saveState());
  }

  handleChangeEdit(index, event) {
    this.editItem(index, (oldItem) => ({
      ...oldItem,
      currentValue: event.target.value,
    }));
  }

  handleSubmitEdit(index, event) {
    this.editItem(index, (oldItem) => ({
      ...oldItem,
      isBeingEdited: false,
      value: oldItem.currentValue,
    }));
    event.preventDefault();
  }

  toggleEditState(index) {
    this.editItem(index, (oldItem) => ({
      ...oldItem,
      isBeingEdited: !oldItem.isBeingEdited,
    }));
  }

  deleteItem(index) {
    const items = this.state.items.slice();
    items.splice(index, 1);
    this.setState({
      items,
    }, () => this.saveState());
  }

  render() {
    const listItems = this.state.items.map((item, index) => (
      <ListItem
        key={item.id}
        value={item}
        onClickEdit={() => this.toggleEditState(index)}
        onClickDelete={() => this.deleteItem(index)}
        handleChangeEdit={(event) => this.handleChangeEdit(index, event)}
        handleSubmitEdit={(event) => this.handleSubmitEdit(index, event)}
      />
    ));
    return (
      <div className="TaskList">
        <header className="TaskList-header">
          My To-Dos
        </header>
        <ol className="TaskList-list">{listItems}</ol>
        <NewTaskForm
          onChange={this.handleChangeAdd}
          onSubmit={this.handleSubmitAdd}
          value={this.state.formValue}
        />
      </div>
    );
  }
}

TaskList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    isBeingEdited: PropTypes.bool.isRequired,
    currentValue: PropTypes.string.isRequired,
  })).isRequired,
};

export default TaskList;
