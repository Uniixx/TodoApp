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
    const {id, color, title, description, creation_date} = this.props.task;
    const isFuture = new Date(creation_date) > new Date();
    const style = {
      header: {
        "background": color !== "" ? color : ""
      }
    }
    return (
      <Draggable isDragDisabled={isFuture} draggableId={id} index={this.props.index}>
        {provided => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Card>
              <Card.Content style={style.header} header={title} />
              <Card.Content>{description}</Card.Content>
              <Card.Content extra>
              { 
                isFuture ? "Beggining " : "Began "  
              }
              {
                <Moment fromNow>{ creation_date }</Moment> 
              }
              </Card.Content>
            </Card>
          </Container>
        )}
      </Draggable>
    );
  }
}
