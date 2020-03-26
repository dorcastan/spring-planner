import React from 'react';
import PropTypes from 'prop-types';
import '../styles/TaskList.scss';

/* ========= TypeScript interfaces ========== */

export interface Item {
  /** The item's id */
  id: number,
  /** The item's saved value */
  value: string,
  /** Whether the item is being edited */
  isBeingEdited: boolean,
  /** The item's current value (used to track state) */
  currentValue: string,
}

interface ListItemProps {
  value: Item,
  handleChangeEdit: React.ChangeEventHandler<HTMLInputElement>,
  handleSubmitEdit: React.FormEventHandler<HTMLFormElement>,
  onClickEdit: () => void,
  onClickDelete: () => void,
}

interface EditTaskFormProps {
  value: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

interface NewTaskFormProps {
  value: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

interface TaskListProps {
  items: Item[]
}

interface TaskListState {
  formValue: string,
  items: Item[]
}

/* ========= ListItem ========== */

const ListItem: React.FC<ListItemProps> = ({
  value, handleChangeEdit, handleSubmitEdit, onClickEdit, onClickDelete,
}) => {
  const editSymbol: string = '\u270e'; // Unicode lower right pencil
  const deleteSymbol: string = 'X';
  const editButtonStyle: string = value.isBeingEdited ? 'TaskList-listbutton-selected' : 'TaskList-listbutton';

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

/* ========= EditTaskForm ========== */

function getResizeWidth(str: string): string {
  return `${(str.length > 0 ? str.length : 1) * 0.75}em`; // TODO: find a better way to resize
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ value, onChange, onSubmit }) => (
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

/* ========= NewTaskForm ========== */

const NewTaskForm: React.FC<NewTaskFormProps> = ({ value, onSubmit, onChange }) => (
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

/* ========= TaskList ========== */

class TaskList extends React.Component<TaskListProps, TaskListState> {
  private defaultFormValue: string;

  static resetItem(item: Item) {
    return {
      ...item,
      isBeingEdited: false,
      currentValue: item.value,
    };
  }

  constructor(props: TaskListProps) {
    super(props);
    this.defaultFormValue = '';
    this.state = {
      formValue: this.defaultFormValue,
      items: JSON.parse(localStorage.getItem('allTasks') as string) || props.items,
    };

    this.handleChangeAdd = this.handleChangeAdd.bind(this);
    this.handleSubmitAdd = this.handleSubmitAdd.bind(this);
    this.handleChangeEdit = this.handleChangeEdit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
  }

  saveState(): void {
    const { items } = this.state;
    const resettedItems = items.map((item: Item) => TaskList.resetItem(item));
    localStorage.setItem('allTasks', JSON.stringify(resettedItems));
  }

  handleChangeAdd: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      formValue: event.target.value,
    });
  };

  handleSubmitAdd(event: React.FormEvent<HTMLFormElement>): void {
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

  editItem(index: number, modifier: (item: Item) => Item): void {
    this.setState((prevState) => {
      const items = prevState.items.slice();
      const oldItem = items[index];
      const newItem = modifier(oldItem);
      items.splice(index, 1, newItem);
      return { items };
    }, () => this.saveState());
  }

  handleChangeEdit(index: number, event: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target;
    this.editItem(index, (oldItem: Item) => ({
      ...oldItem,
      currentValue: value,
    }));
  }

  handleSubmitEdit(index: number, event: React.FormEvent<HTMLFormElement>): void {
    this.editItem(index, (oldItem: Item) => ({
      ...oldItem,
      isBeingEdited: false,
      value: oldItem.currentValue,
    }));
    event.preventDefault();
  }

  toggleEditState(index: number): void {
    this.editItem(index, (oldItem: Item) => ({
      ...oldItem,
      isBeingEdited: !oldItem.isBeingEdited,
    }));
  }

  deleteItem(index: number): void {
    this.setState((prevState) => {
      const items = prevState.items.slice();
      items.splice(index, 1);
      return { items };
    }, () => this.saveState());
  }

  render() {
    const { items, formValue } = this.state;
    const listItems = items.map((item: Item, index: number) => (
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

// @ts-ignore
TaskList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    isBeingEdited: PropTypes.bool.isRequired,
    currentValue: PropTypes.string.isRequired,
  })).isRequired,
};

export default TaskList;
