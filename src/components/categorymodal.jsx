import React, { Component } from "react";

import { BlockPicker } from "react-color";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import {
  Button,
  Modal,
  Form,
  Input,
  Message,
  Transition
} from "semantic-ui-react";

export default class CategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      color: "",
      options: [],
      typename: "",
      projectname: "",
      colorModalOpen: false,
      typeModalOpen: false
    };

    this.newCategory = this.newCategory.bind(this);
    this.forceClose = this.forceClose.bind(this);
    this.OpenClosePicker = this.OpenClosePicker.bind(this);
    this.handleChangePicker = this.handleChangePicker.bind(this);
  }

  emptyErrors() {
    this.setState({ errors: [] });
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

  handleChangePicker(color) {
    this.setState({
      colorModalOpen: !this.state.colorModalOpen,
      color: color.hex
    });
  }

  OpenClosePicker() {
    this.setState({
      colorModalOpen: !this.state.colorModalOpen
    });
  }

  verifyExistanceOfCategory() {
    const { options, typename } = this.state;
    return options.some(option => option.text === typename);
  }

  verifyData() {
        const { typename } = this.state;
    
        this.emptyErrors();
    
        let errorsArr = [];
    
        if (typename.trim() === "") {
          errorsArr.push("Category name can't be empty");
        }
    
        if (this.verifyExistanceOfCategory()) {
          errorsArr.push("Category with this name already exists.");
        }
    
        this.setState({
          errors: errorsArr
        });
    
        return errorsArr.length !== 0;
  }

  newCategory(e, { name, value }) {
    const { options, typename, color } = this.state;

    if (this.verifyExistanceOfCategory()) return;

    if (name === "typeModalOpen") {
      this.setState({ typeModalOpen: false });
    }

    const data = [
        ...options,
        { key: typename, text: typename, value: typename, color: color }
      ];

    this.props.update(data);
  }

  render() {
    const { typeModalOpen, colorModalOpen, color, errors } = this.state;
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
            <Form.Field
        label="&nbsp;"
        control={Button}
        name="typeModalOpen"
        onClick={this.handleOpenOrClose}
        color="green"
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
    <Transition visible={typeModalOpen} animation="scale" duration={400}>
    <Modal open={typeModalOpen} centered={false}>
      <Modal.Header>Add new Category</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          {errors.length !== 0 ? (
            <Message error header="Some error happened???" list={errors} />
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
                onClick={this.newCategory}
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
        </div>)
  }
}
