import React, { Component } from "react";

import CategoryModal from "../components/categorymodal";

import { DateTimeInput } from "semantic-ui-calendar-react";

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

export default class ProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectname: "",
      projecttype: "",
      projectdescription: "",
      typename: "",
      dateTime: "",
      taskModalOpen: false,
      projects: {},
      errors: []
    };

    this.forceClose = this.forceClose.bind(this);
    this.newProject = this.newProject.bind(this);
  }

  async newProject(e, { name, value }) {
    debugger;
    const {
      projects,
      columns,
      projectname,
      projectdescription,
      dateTime,
      typename,
      color
    } = this.state;

    this.emptyErrors();

    if (this.verifyData()) return;

    if (name === "taskModalOpen") {
      this.setState({ taskModalOpen: false });
    }

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

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };

  handleOpenOrClose = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: !value });
    }
  };

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

  verifyExistanceOfTask() {
    const { projects, projectname } = this.state;
    return projects.hasOwnProperty(projectname);
  }

  render() {
    const { taskModalOpen, errors } = this.state;

    return (
      <div>
        <Button name="taskModalOpen" onClick={this.handleOpenOrClose}>
          Add
        </Button>
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
                    <CategoryModal update={this.props.update}></CategoryModal>
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
                      onClick={this.newProject}
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
