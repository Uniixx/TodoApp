import React, { Component } from "react";

import { DragDropContext } from "react-beautiful-dnd";

import { Button } from "semantic-ui-react";

import ProjectModal from "../components/projectmodal";

import "moment/locale/ca";

import styled from "styled-components";

import Column from "../components/column";

import "semantic-ui-css/semantic.min.css";

import axios from "axios";

const baseUrl = "http://localhost:51224/";

const Container = styled.div`
  display: flex;
`;

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      columns: {},
      columnsort: []
    };
  }

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

      debugger;
      const newTaskIds = Array.from(begin.projects);

      newTaskIds.splice(source.index, 1);

      newTaskIds.splice(destination.index, 0, begin.projects.find(p => p.name == draggableId))

      const newColumn = {
        ...begin,
        projects: newTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.name]: newColumn
        }
      };
      this.setState(newState);
      return;
    }

    const beginTaskIds = Array.from(begin.projects);

    beginTaskIds.splice(source.index, 1);

    const newBegin = {
      ...begin,
      projects: beginTaskIds
    };
    const endTaskIds = Array.from(begin.projects);

    endTaskIds.splice(destination.index, 0, draggableId);

    let projectFound = begin.projects.find(
      p => p.name == endTaskIds[endTaskIds.indexOf(p.name)]
    );  

    const newEnd = {
      ...end,
      projects: [...end.projects, projectFound]
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newBegin.name]: newBegin,
        [newEnd.name]: newEnd
      }
    };
    this.setState(newState);
  };

  async getColumns() {
    const response = await axios.get(`${baseUrl}column`);
    const data = response.data;
    const store = {};

    data.forEach(obj => {
      store[obj.name] = obj;
    });

    this.setState({ columns: store });
    this.setState({ columnsort: Object.keys(store) });
  }

  componentDidMount() {
    this.getColumns();
  }

  DisplayCategories = () => {
    const { options } = this.state;
    return options.map(category => {
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
    });
  };

  updateState(data) {
    this.setState({ options: data });
  }

  DisplayColumns = () => {
    const { columnsort, columns } = this.state;
    return columnsort.map(columnId => {
      const column = columns[columnId];
      const projectsArr = column.projects;
      return <Column key={Column.id} column={column} tasks={projectsArr} />;
    });
  };

  render() {
    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Container>{this.DisplayColumns()}</Container>
        </DragDropContext>
        <ProjectModal update={this.updateState.bind(this)}></ProjectModal>
        {this.DisplayCategories()}
      </div>
    );
  }
}
