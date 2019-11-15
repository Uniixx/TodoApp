import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  TextArea,
  Message,
  Transition
} from "semantic-ui-react";

import { BlockPicker } from "react-color";

import { DateTimeInput } from "semantic-ui-calendar-react";

import "moment/locale/ca";

import styled from "styled-components";

import Column from "../components/column";

import "semantic-ui-css/semantic.min.css";

import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const baseUrl = "http://localhost:51224/";

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
      typename: "",
      typeModalOpen: false,
      taskModalOpen: false,
      colorModalOpen: false,
      projects: {},
      errors: [],
      columns: {
        // "column-1": {
        //   id: "column-1",
        //   title: "To Sort",
        //   taskIds: []
        // },
        // "column-2": {
        //   id: "column-2",
        //   title: "To-Do",
        //   taskIds: []
        // },
        // "column-3": {
        //   id: "column-3",
        //   title: "In Progress",
        //   taskIds: []
        // },
        // "column-4": {
        //   id: "column-4",
        //   title: "Done",
        //   taskIds: []
        // }
      },
      columnsort: []
    };

    this.newTask = this.newTask.bind(this);
    this.newType = this.newType.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.verifyExistanceOfTask = this.verifyExistanceOfTask.bind(this);
    this.handleOpenOrClose = this.handleOpenOrClose.bind(this);
    this.OpenClosePicker = this.OpenClosePicker.bind(this);
    this.handleChangePicker = this.handleChangePicker.bind(this);
    this.forceClose = this.forceClose.bind(this);
    this.verifyExistanceOfCategory = this.verifyExistanceOfCategory.bind(this);
    this.handleError = this.handleError.bind(this);
    this.verifyData = this.verifyData.bind(this);
  }

  // onBeforeCapture = () => {
  //   /*...*/
  // };

  // onBeforeDragStart = () => {
  //   /*...*/
  // };

  // onDragStart = () => {
  //   /*...*/
  // };
  // onDragUpdate = () => {
  //   /*...*/
  // };

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

  async getColumns() {
    const { columns, columnsort } = this.state;
    const response = await axios.get(`${baseUrl}column`);
    const data = response.data;
    const store = {};

    data.forEach(obj => {
      (store[obj.name] = obj)
      this.setState({ columnsort: [...columnsort, obj.name]})
    });
    this.setState({ columns: store });
  }

  // async getProjects() {
  //   const data = await axios.get(`${baseUrl}project`);

  // }

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

  handleError() {}

  verifyExistanceOfCategory() {
    const { options, typename } = this.state;
    return options.some(option => option.text === typename);
  }

  newType(e, { name, value }) {
    const { options, typename, color } = this.state;

    if (this.verifyExistanceOfCategory()) return;

    if (name === "typeModalOpen") {
      this.setState({ typeModalOpen: false });
    }
    this.setState({
      options: [
        ...options,
        { key: typename, text: typename, value: typename, color: color }
      ]
    });
  }

  forceClose(e, { name, value }) {
    this.setState({
      [name]: false
    });

    this.emptyErrors();
  }

  emptyErrors() {
    this.setState({ errors: [] });
  }

  verifyData() {
    const { projectname, dateTime } = this.state;

    this.emptyErrors();

    let errorsArr = [];

    if (projectname.trim() === "") {
      errorsArr.push("Project name can't be empty");
    }

    if (this.verifyExistanceOfTask()) {
      errorsArr.push("Task with this name already exists.");
    }

    if (dateTime.trim() === "") {
      errorsArr.push("Project date can't be empty");
    }

    this.setState({
      errors: errorsArr
    });

    return errorsArr.length !== 0;
  }

  async newTask(e, { name, value }) {
    debugger;
    const {
      projects,
      columns,
      projectname,
      projectdescription,
      dateTime,
      typename,
      color,
      errors
    } = this.state;

    this.emptyErrors();

    if (this.verifyData()) return;

    if (name === "taskModalOpen") {
      this.setState({ taskModalOpen: false });
    }

    // const response = await axios.post(`${baseUrl}project`, {
    //   "Id": "2",
    //   "ColumnId": "1",
    //   "Name": projectname,
    //   "Description": projectdescription,
    //   "Category": typename,
    //   "Creation_Date": new Date()
    // });

    // console.log(response);

    this.setState({
      projects: {
        ...projects,
        [this.state.projectname]: {
          id: projectname,
          title: projectname,
          description: projectdescription,
          creation_date: dateTime,
          category: typename,
          color: color
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

  componentDidMount() {
    this.getColumns();
  }

  render() {
    const {
      columnsort,
      columns,
      projects,
      taskModalOpen,
      typeModalOpen,
      colorModalOpen,
      color,
      options,
      errors
    } = this.state;

    const style = {
      container: {
        position: "relative"
      },
      dropdown: {
        position: "absolute"
      },
      text: {
        float: "left",
        clear: "both"
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
            {/* {columnsort.map(columnId => {
              const column = columns[columnId];
              const projectsarr = column.rawData.map(
                taskId => projects[taskId]
              );
              return (
                <Column key={Column.id} column={column} tasks={projectsarr} />
              );
            })} */}
          </Container>
        </DragDropContext>
        <Button name="taskModalOpen" onClick={this.handleOpenOrClose}>
          Add
        </Button>
        {options.map(category => {
          return (
            <figure>
              <div
                style={{
                  background: category.color,
                  width: "15px",
                  height: "15px"
                }}
              />
              <figcaption>{category.text}</figcaption>
            </figure>
          );
        })}
        <Transition visible={taskModalOpen} animation="scale" duration={400}>
          <Modal open={taskModalOpen} centered={false}>
            <Modal.Header>Add a new project</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                {errors.length !== 0 ? (
                  <Message
                    error
                    header="Some error happened???"
                    list={errors}
                  />
                ) : (
                  ""
                )}
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
                      label="Project Started on"
                      placeholder="Project Start Date"
                      value={this.state.dateTime}
                      iconPosition="left"
                      autoComplete="off"
                      onChange={this.handleChange}
                    />
                    <Form.Field
                      name="projecttype"
                      control={Select}
                      label="Project Category"
                      options={this.state.options}
                      placeholder="Project Category"
                      onChange={this.handleChange}
                    />
                    <Form.Field
                      label="&nbsp;"
                      control={Button}
                      name="typeModalOpen"
                      onClick={this.handleOpenOrClose}
                      color="green"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                    />
                    <Transition
                      visible={typeModalOpen}
                      animation="scale"
                      duration={400}
                    >
                      <Modal open={typeModalOpen} centered={false}>
                        <Modal.Header>Add new Category</Modal.Header>
                        <Modal.Content image>
                          <Modal.Description>
                            {errors.length !== 0 ? (
                              <Message
                                error
                                header="Some error happened???"
                                list={errors}
                              />
                            ) : (
                              ""
                            )}
                            <Form>
                              <Form.Group>
                                <Form.Field
                                  name="typename"
                                  control={Input}
                                  label="Category Name"
                                  placeholder="Category Name"
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
                                <Button
                                  color="red"
                                  onClick={this.forceClose}
                                  name="typeModalOpen"
                                >
                                  Close
                                </Button>
                              </Form.Group>
                            </Form>
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                    </Transition>
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
                    <Button
                      color="red"
                      onClick={this.forceClose}
                      name="taskModalOpen"
                    >
                      Close
                    </Button>
                  </Form.Group>
                </Form>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Transition>
      </div>
    );
  }
}
