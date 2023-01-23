import "../styles/Board.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import List from "./List";

class Board extends Component {
  fetchBoard = async () => {
    const { dispatch } = this.props;
    const truckResponse = await fetch("/api/trucks");
    const data = await truckResponse.json();
    const statusResponse = await fetch("/api/status");
    const statusData = await statusResponse.json();
    const stateLists = {};
    statusData.forEach(status => {
      stateLists[status.id] = {
        _id: status.id,
        title: status.name,
        cards: []
      };
    });
    const stateCards = {};
    data.forEach(truck => {
      stateCards[truck.id] = {
        _id: truck.id,
        text: truck.name
      };
      stateLists[truck.status.id].cards.push(truck.id);
    });
    dispatch({
      type: "INITIALIZE_CARDS",
      payload: { cardsById: stateCards }
    });
    dispatch({
      type: "INITIALIZE_LISTS",
      payload: { listsById: stateLists }
    });
    dispatch({
      type: "INITIALIZE_BOARD",
      payload: { board: { lists: Object.keys(stateLists) } }
    });
  }; 
  
  componentDidMount() {
    this.fetchBoard();
  }

  state = {
    addingList: false
  };

  toggleAddingList = () =>
    this.setState({ addingList: !this.state.addingList });

  handleDragEnd = ({ source, destination, type }) => {
    // dropped outside the allowed zones
    if (!destination) return;

    const { dispatch } = this.props;

    // Move list
    if (type === "COLUMN") {
      // Prevent update if nothing has changed
      if (source.index !== destination.index) {
        dispatch({
          type: "MOVE_LIST",
          payload: {
            oldListIndex: source.index,
            newListIndex: destination.index
          }
        });
      }
      return;
    }

    // Move card
    if (
      source.index !== destination.index ||
      source.droppableId !== destination.droppableId
    ) {
      dispatch({
        type: "MOVE_CARD",
        payload: {
          sourceListId: source.droppableId,
          destListId: destination.droppableId,
          oldCardIndex: source.index,
          newCardIndex: destination.index
        }
      });
    }
  };

  render() {
    const { board } = this.props;
    const { addingList } = this.state;

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided, _snapshot) => (
            <div className="Board" ref={provided.innerRef}>
              {board.lists.map((listId, index) => {
                return <List edit={this.props.edit} listId={listId} key={listId} index={index} />;
              })}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

const mapStateToProps = state => ({ board: state.board });

export default connect(mapStateToProps)(Board);
