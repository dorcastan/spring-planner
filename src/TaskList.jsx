import React from 'react';
import PropTypes from 'prop-types';
import './TaskList.scss';

function getResizeWidth(string) {
  return `${(string.length > 0 ? string.length : 1) * 0.75}em`; // TODO: find a better way to resize
}

const EditTaskForm = ({ value, onSubmit, onChange }) => (
  <form style={{ width: '100%' }} onSubmit={onSubmit}>
    <input
      className="TaskList-forminput"
      type="text"
      value={value}
      onChange={onChange}
      style={{ width: getResizeWidth(value) }}
    />
  </form>
);

EditTaskForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const ListItem = ({
  value, handleChangeEdit, handleSubmitEdit, onClickEdit, onClickDelete,
}) => {
  const editSymbol = '\u270e'; // Unicode lower right pencil
  const deleteSymbol = 'X';
  const editButtonStyle = value.isBeingEdited ? 'TaskList-listbutton-selected' : 'TaskList-listbutton';

  let elementToDisplay;
  if (value.isBeingEdited) {
    elementToDisplay = (
      <EditTaskForm
        value={value.currentValue}
        onChange={handleChangeEdit}
        onSubmit={handleSubmitEdit}
      />
    );
  } else {
    elementToDisplay = <span className="TaskList-text">{value.value}</span>;
  }

  return (
    <li>
      <span className="TaskList-listitem">
        <span className="TaskList-listtext">
          {elementToDisplay}
        </span>
        <span>
          <button className={editButtonStyle} type="submit" onClick={onClickEdit}>
            {editSymbol}
          </button>
          <button className="TaskList-listbutton" type="submit" onClick={onClickDelete}>
            {deleteSymbol}
          </button>
        </span>
      </span>
    </li>
  );
};

ListItem.propTypes = {
  value: PropTypes.shape({
    id: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    isBeingEdited: PropTypes.bool.isRequired,
    currentValue: PropTypes.string.isRequired,
  }).isRequired,
  handleChangeEdit: PropTypes.func.isRequired,
  handleSubmitEdit: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
};

const NewTaskForm = ({ value, onSubmit, onChange }) => (
  <form
    className="TaskList-newform"
    onSubmit={onSubmit}
  >
    <input
      className="TaskList-forminput"
      type="text"
      placeholder="Add a new task"
      value={value}
      onChange={onChange}
      style={{ width: getResizeWidth(value) }}
    />
  </form>
);

NewTaskForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

class TaskList extends React.Component {
  static resetItem(item) {
    return {
      ...item,
      isBeingEdited: false,
      currentValue: item.value,
    };
  }

  constructor(props) {
    super(props);
    this.defaultFormValue = '';
    this.state = {
      formValue: this.defaultFormValue,
      items: JSON.parse(localStorage.getItem('allTasks')) || props.items,
    };

    this.handleChangeAdd = this.handleChangeAdd.bind(this);
    this.handleSubmitAdd = this.handleSubmitAdd.bind(this);
    this.handleChangeEdit = this.handleChangeEdit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
  }

  saveState() {
    const { items } = this.state;
    const resettedItems = items.map((item) => TaskList.resetItem(item));
    localStorage.setItem('allTasks', JSON.stringify(resettedItems));
  }

  handleChangeAdd(event) {
    this.setState({
      formValue: event.target.value,
    });
  }

  handleSubmitAdd(event) {
    const { formValue, items } = this.state;
    const newItem = {
      id: new Date().getTime(),
      value: formValue,
      isBeingEdited: false,
      currentValue: formValue,
    };
    this.setState({
      formValue: this.defaultFormValue,
      items: [...items, newItem],
    }, () => this.saveState());
    event.preventDefault();
  }

  editItem(index, modifier) {
    this.setState((prevState) => {
      const items = prevState.items.slice();
      const oldItem = items[index];
      const newItem = modifier(oldItem);
      items.splice(index, 1, newItem);
      return { items };
    }, () => this.saveState());
  }

  handleChangeEdit(index, event) {
    const { value } = event.target;
    this.editItem(index, (oldItem) => ({
      ...oldItem,
      currentValue: value,
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
    this.setState((prevState) => {
      const items = prevState.items.slice();
      items.splice(index, 1);
      return { items };
    }, () => this.saveState());
  }

  render() {
    const { items, formValue } = this.state;
    const listItems = items.map((item, index) => (
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
          value={formValue}
          onChange={this.handleChangeAdd}
          onSubmit={this.handleSubmitAdd}
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
