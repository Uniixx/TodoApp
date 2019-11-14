import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

import Moment from "react-moment";

import { Card } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const Container = styled.div`
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: transparent;
`;

export default class Task extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {provided => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Card>
              <Card.Content header={this.props.task.title} />
              <Card.Content>{this.props.task.description}</Card.Content>
              <Card.Content extra>
                Began: <Moment fromNow>{this.props.task.creation_date}</Moment>
              </Card.Content>
            </Card>
          </Container>
        )}
      </Draggable>
    );
  }
}
