import { combineReducers, createStore } from "redux";
import throttle from "lodash.throttle";

const board = (state = { lists: [] }, action) => {
  switch (action.type) {
    case "INITIALIZE_BOARD": {
      const { board } = action.payload;
      return board;
    }
    case "ADD_LIST": {
      const { listId } = action.payload;
      return { lists: [...state.lists, listId] };
    }
    case "MOVE_LIST": {
      const { oldListIndex, newListIndex } = action.payload;
      const newLists = Array.from(state.lists);
      const [removedList] = newLists.splice(oldListIndex, 1);
      newLists.splice(newListIndex, 0, removedList);
      return { lists: newLists };
    }
    case "DELETE_LIST": {
      const { listId } = action.payload;
      const filterDeleted = tmpListId => tmpListId !== listId;
      const newLists = state.lists.filter(filterDeleted);
      return { lists: newLists };
    }
    default:
      return state;
  }
};

const listsById = (state = {}, action) => {
  switch (action.type) {
    case "INITIALIZE_LISTS": {
      const { listsById } = action.payload;
      return listsById;
    }
    case "ADD_LIST": {
      const { listId, listTitle } = action.payload;
      fetch('/api/create-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: listId,
          name: listTitle
        })
      });
      return {
        ...state,
        [listId]: { _id: listId, title: listTitle, cards: [] }
      };
    }
    case "CHANGE_LIST_TITLE": {
      const { listId, listTitle } = action.payload;
      fetch('/api/update-status-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          statusId: listId,
          name: listTitle
        })
      });

      return {
        ...state,
        [listId]: { ...state[listId], title: listTitle }
      };
    }
    case "DELETE_LIST": {
      const { listId } = action.payload;
      const { [listId]: deletedList, ...restOfLists } = state;
      return restOfLists;
    }
    case "ADD_CARD": {
      const { listId, cardId } = action.payload;
      return {
        ...state,
        [listId]: { ...state[listId], cards: [...state[listId].cards, cardId] }
      };
    }
    case "MOVE_CARD": {
      const {
        oldCardIndex,
        newCardIndex,
        sourceListId,
        destListId
      } = action.payload;
      // Move within the same list
      if (sourceListId === destListId) {
        const newCards = Array.from(state[sourceListId].cards);
        const [removedCard] = newCards.splice(oldCardIndex, 1);
        newCards.splice(newCardIndex, 0, removedCard);
        return {
          ...state,
          [sourceListId]: { ...state[sourceListId], cards: newCards }
        };
      }
      // Move card from one list to another
      const sourceCards = Array.from(state[sourceListId].cards);
      const [removedCard] = sourceCards.splice(oldCardIndex, 1);
      const destinationCards = Array.from(state[destListId].cards);
      destinationCards.splice(newCardIndex, 0, removedCard);
      fetch('/api/update-truck-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          truckId: removedCard,
          statusId: destListId
        })
      });
      return {
        ...state,
        [sourceListId]: { ...state[sourceListId], cards: sourceCards },
        [destListId]: { ...state[destListId], cards: destinationCards }
      };
    }
    case "DELETE_CARD": {
      const { cardId: deletedCardId, listId } = action.payload;
      const filterDeleted = cardId => cardId !== deletedCardId;
      fetch('/api/delete-truck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          truckId: deletedCardId
        })
      });
      return {
        ...state,
        [listId]: {
          ...state[listId],
          cards: state[listId].cards.filter(filterDeleted)
        }
      };
    }
    default:
      return state;
  }
};

const cardsById = (state = {}, action) => {
  switch (action.type) {
    case "INITIALIZE_CARDS": {
      const { cardsById } = action.payload;
      return cardsById;
    }
    case "ADD_CARD": {
      const { cardText, cardId, listId } = action.payload;
      fetch('/api/create-truck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          truckId: cardId,
          name: cardText,
          statusId: listId
        })
      });
      return { ...state, [cardId]: { text: cardText, _id: cardId } };
    }
    case "CHANGE_CARD_TEXT": {
      const { cardText, cardId } = action.payload;
      fetch('/api/update-truck-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          truckId: cardId,
          name: cardText
        })
      });
      return { ...state, [cardId]: { ...state[cardId], text: cardText } };
    }
    case "DELETE_CARD": {
      const { cardId } = action.payload;
      const { [cardId]: deletedCard, ...restOfCards } = state;
      return restOfCards;
    }
    // Find every card from the deleted list and remove it
    case "DELETE_LIST": {
      const { cards: cardIds } = action.payload;
      return Object.keys(state)
        .filter(cardId => !cardIds.includes(cardId))
        .reduce(
          (newState, cardId) => ({ ...newState, [cardId]: state[cardId] }),
          {}
        );
    }
    default:
      return state;
  }
};

const reducers = combineReducers({
  board,
  listsById,
  cardsById
});

const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch {
    // ignore write errors
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const persistedState = loadState();
const store = createStore(reducers, persistedState);

store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000)
);

console.log(store.getState());

export default store;
