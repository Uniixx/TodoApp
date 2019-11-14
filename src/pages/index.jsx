import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  TextArea
} from "semantic-ui-react";

import { BlockPicker } from "react-color";

import { DateTimeInput } from "semantic-ui-calendar-react";

import "moment/locale/ca";

import styled from "styled-components";

import Column from "../components/column";

import "semantic-ui-css/semantic.min.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  display: flex;
`;

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectname: "",
      projecttype: "",
      projectdescription: "",
      color: "",
      dateTime: "",
      options: [],
      typename: '',
      typeModalOpen: false,
      taskModalOpen: false,
      colorModalOpen: false,
      projects: {},
      columns: {
        "column-1": {
          id: "column-1",
          title: "To Sort",
          taskIds: []
        },
        "column-2": {
          id: "column-2",
          title: "To-Do",
          taskIds: []
        },
        "column-3": {
          id: "column-3",
          title: "In Progress",
          taskIds: []
        },
        "column-4": {
          id: "column-4",
          title: "Done",
          taskIds: []
        }
      },
      columnsort: ["column-1", "column-2", "column-3", "column-4"]
    };

    this.newTask = this.newTask.bind(this);
    this.newType = this.newType.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.verifyExistanceOfTask = this.verifyExistanceOfTask.bind(this);
    this.handleOpenOrClose = this.handleOpenOrClose.bind(this);
    this.OpenClosePicker = this.OpenClosePicker.bind(this);
    this.handleChangePicker = this.handleChangePicker.bind(this);
    this.forceClose = this.forceClose.bind(this);
  }

  onBeforeCapture = () => {
    /*...*/
  };

  onBeforeDragStart = () => {
    /*...*/
  };

  onDragStart = () => {
    /*...*/
  };
  onDragUpdate = () => {
    /*...*/
  };

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const begin = this.state.columns[source.droppableId];
    const end = this.state.columns[destination.droppableId];

    if (begin === end) {
      const newTaskIds = Array.from(begin.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...begin,
        taskIds: newTaskIds
      };
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      };
      this.setState(newState);
      return;
    }
    const beginTaskIds = Array.from(begin.taskIds);
    beginTaskIds.splice(source.index, 1);
    const newBegin = {
      ...begin,
      taskIds: beginTaskIds
    };
    const endTaskIds = Array.from(end.taskIds);
    endTaskIds.splice(destination.index, 0, draggableId);
    const newEnd = {
      ...end,
      taskIds: endTaskIds
    };
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newBegin.id]: newBegin,
        [newEnd.id]: newEnd
      }
    };
    this.setState(newState);
  };

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };

  handleChangePicker(color) {
    this.setState({
      colorModalOpen: !this.state.colorModalOpen,
      color: color.hex
    });
  }

  handleOpenOrClose = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: !value });
    }
  };

  OpenClosePicker() {
    this.setState({
      colorModalOpen: !this.state.colorModalOpen
    });
  }

  verifyExistanceOfTask() {
    const { projects, projectname } = this.state;
    return projects.hasOwnProperty(projectname);
  }

  newType(e, { name, value }) {
    const {options, typename, color} = this.state;
    if (name === "typeModalOpen") {
      this.setState({ typeModalOpen: false });
    }
    this.setState({
        options: [...options, { key: typename[0], text: typename, value: typename }]
    })
  }

  forceClose(e, {name, value}) {
      this.setState({
          [name]: false
      })
  }

  newTask(e, { name, value }) {
    const { projects, columns } = this.state;

    if (this.verifyExistanceOfTask()) return;

    console.log(name);

    if (name === "taskModalOpen") {
      this.setState({ taskModalOpen: false });
    }

    this.setState({
      projects: {
        ...projects,
        [this.state.projectname]: {
          id: this.state.projectname,
          title: this.state.projectname,
          description: this.state.projectdescription,
          creation_date: this.state.dateTime
        }
      }
    });
    let newState = columns;
    newState["column-1"].taskIds.push(this.state.projectname);
    this.setState({
      columns: {
        ...newState
      }
    });
  }

  render() {
    const {
      columnsort,
      columns,
      projects,
      taskModalOpen,
      typeModalOpen,
      colorModalOpen,
      color
    } = this.state;

    const style = {
      container: {
        position: "relative"
      },
      dropdown: {
        position: "absolute"
      },
      box: {
        width: "15px",
        height: "15px",
        background: color
      }
    };
    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Container>
            {columnsort.map(columnId => {
              const column = columns[columnId];
              const projectsarr = column.taskIds.map(
                taskId => projects[taskId]
              );
              return (
                <Column key={Column.id} column={column} tasks={projectsarr} />
              );
            })}
          </Container>
        </DragDropContext>
        <Modal
          open={taskModalOpen}
          trigger={
            <Button name="taskModalOpen" onClick={this.handleOpenOrClose}>
              Add
            </Button>
          }
          centered={false}
        >
          <Modal.Header>Add a new project</Modal.Header>
          <Modal.Content image>
            <Modal.Description>
              <Form>
                <Form.Group widths="equal">
                  <Form.Field
                    name="projectname"
                    control={Input}
                    label="Project name"
                    placeholder="Project name"
                    onChange={this.handleChange}
                  />
                  <DateTimeInput
                    dateFormat="MM/DD/YYYY"
                    name="dateTime"
                    label="Project start date"
                    placeholder="Project start date"
                    value={this.state.dateTime}
                    iconPosition="left"
                    autoComplete="off"
                    onChange={this.handleChange}
                  />
                  <Form.Field
                    name="projecttype"
                    control={Select}
                    label="Project type"
                    options={this.state.options}
                    placeholder="Project type"
                    onChange={this.handleChange}
                  />
                  <Form.Field label="&nbsp;" control={Button} name="typeModalOpen" onClick={this.handleOpenOrClose} color='green' icon={<FontAwesomeIcon icon={faPlus}/>} />
                  <Modal
                      open={typeModalOpen}
                      centered={false}
                    >
                      <Modal.Header>Add new type</Modal.Header>
                      <Modal.Content image>
                        <Modal.Description>
                          <Form>
                            <Form.Group>
                              <Form.Field
                                name="typename"
                                control={Input}
                                label="Type name"
                                placeholder="Type name"
                                onChange={this.handleChange}
                              />
                              <div style={style.container}>
                                <Form.Field
                                  name="colorModalOpen"
                                  control={Input}
                                  label="Color"
                                  onFocus={this.OpenClosePicker}
                                  placeholder="Color"
                                  value={color}
                                />
                                {colorModalOpen ? (
                                  <BlockPicker
                                    name="color"
                                    color={color}
                                    onChange={this.handleChangePicker}
                                    style={style.dropdown}
                                  />
                                ) : null}
                              </div>
                              <Form.Field>
                                <div style={style.box}></div>
                              </Form.Field>
                            </Form.Group>
                            <Form.Group>
                            <Form.Field
                              onClick={this.newType}
                              name="typeModalOpen"
                              control={Button}
                            >
                              Submit
                            </Form.Field>
                            <Button color='red' onClick={this.forceClose} name="typeModalOpen">Close</Button>
                            </Form.Group>
                          </Form>
                        </Modal.Description>
                      </Modal.Content>
                    </Modal>
                </Form.Group>
                <Form.Field
                  name="projectdescription"
                  control={TextArea}
                  label="Description"
                  placeholder="Describe your project in a few words..."
                  onChange={this.handleChange}
                />
                <Form.Group>
                <Form.Field
                  onClick={this.newTask}
                  name="taskModalOpen"
                  control={Button}
                >
                  Submit
                </Form.Field>
                <Button color='red' onClick={this.forceClose} name="taskModalOpen">Close</Button>
                </Form.Group>
              </Form>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
