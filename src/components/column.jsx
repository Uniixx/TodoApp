import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./task";
import styled from "styled-components";

import { Card } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const Container = styled.div`
  margin: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

const TaskList = styled.div`
  padding: 10px;
  flex-grow: 1;
  min-height: 100px;
  background-color: ${props => props.isDraggingOver ? 'skyblue' : 'white'}
`;

export default class Column extends React.Component {
  render() {
    return (
      <Container>
        <Card>
          <Card.Content header={this.props.column.name} />
          <Card.Content>
            <Droppable droppableId={this.props.column.name}>
              {(provided, snapshot) => (
                <TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                  {this.props.tasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </Card.Content>
        </Card>
      </Container>
    );
  }
}
