import * as UUID from 'uuid';
import {DFA} from '../automata/DFA';

type Edges = { [letter: string]: string | undefined };

/**
 * A DFA state for the DFA editor.
 */
export type DFAState = {
  // The name of the state.
  name: string;
  // Whether the state is an accepting state.
  final: boolean;
  // Edges that originate from this state.
  edges: Edges;
};

/**
 * A map of state IDs to DFA states for the DFA editor.
 */
export type DFAStates = {
  [id: string]: DFAState
}

/**
 * The overall state of the DFA editor.
 */
export type DFAEditorState = {
  // All DFA states.
  dfaStates: DFAStates;
  // The ID of the initial DFA state.
  initialStateID?: string;
}

type ResetAction = { type: 'RESET' };
type AddStateAction = { type: 'ADD_STATE' };
type DeleteStateAction = { type: 'DELETE_STATE', id: string };
type RenameStateAction = { type: 'RENAME_STATE', id: string, newName: string };
type SetEdgeAction = { type: 'SET_EDGE', fromID: string, toID: string | undefined, letter: string };
type SetInitialStateAction = { type: 'SET_INITIAL_STATE', id: string };
type SetFinalStateAction = { type: 'SET_FINAL_STATE', id: string, final: boolean };

/**
 * Actions to modify the DFA editor state.
 */
export type DFAEditorAction =
  | ResetAction
  | AddStateAction
  | DeleteStateAction
  | RenameStateAction
  | SetEdgeAction
  | SetInitialStateAction
  | SetFinalStateAction;

/**
 * The initial DFA editor state.
 */
export const initialDFAEditorState: DFAEditorState = {
  dfaStates: {},
};

/**
 * Resets the DFA editor state.
 */
function resetAction(): DFAEditorState {
  return initialDFAEditorState;
}

/**
 * Adds a new DFA state.
 */
function addStateAction(state: DFAEditorState): DFAEditorState {
  const id = UUID.v4();
  return {
    ...state,
    dfaStates: {
      ...state.dfaStates,
      [id]: {
        name: getNextStateNumber(state.dfaStates).toString(),
        final: false,
        edges: {},
      }
    },
    initialStateID: state.initialStateID || id,
  }
}

/**
 * Deletes a DFA state.
 */
function deleteStateAction(state: DFAEditorState, action: DeleteStateAction): DFAEditorState {
  return {
    ...state,
    dfaStates: Object.entries(state.dfaStates).reduce((acc, [id, state]) => id === action.id ? acc : {
      ...acc,
      [id]: state
    }, {}),
    initialStateID: state.initialStateID === action.id ? undefined : state.initialStateID
  }
}

/**
 * Renames a DFA state.
 */
function renameStateAction(state: DFAEditorState, action: RenameStateAction): DFAEditorState {
  return {
    ...state,
    dfaStates: {
      ...state.dfaStates,
      [action.id]: {
        ...state.dfaStates[action.id],
        name: action.newName,
      }
    }
  }
}

/**
 * Modifies a DFA edge.
 */
function setEdgeAction(state: DFAEditorState, action: SetEdgeAction): DFAEditorState {
  if (action.toID && !state.dfaStates[action.toID]) {
    throw new Error('Cannot add edge to non-existent state.');
  }
  return {
    ...state,
    dfaStates: {
      ...state.dfaStates,
      [action.fromID]: {
        ...state.dfaStates[action.fromID],
        edges: {
          ...state.dfaStates[action.fromID].edges,
          [action.letter]: action.toID,
        }
      }
    }
  }
}

/**
 * Sets the initial DFA state.
 */
function setInitialStateAction(state: DFAEditorState, action: SetInitialStateAction): DFAEditorState {
  if (!state.dfaStates[action.id]) {
    throw new Error('Cannot set initial state to non-existent state.');
  }
  return {
    ...state,
    initialStateID: action.id,
  }
}

/**
 * Sets whether a DFA state is an accepting state.
 */
function setFinalStateAction(state: DFAEditorState, action: SetFinalStateAction): DFAEditorState {
  return {
    ...state,
    dfaStates: {
      ...state.dfaStates,
      [action.id]: {
        ...state.dfaStates[action.id],
        final: action.final,
      }
    }
  }
}

export function DFAEditorReducer(state: DFAEditorState, action: DFAEditorAction): DFAEditorState {
  switch (action.type) {
    case 'RESET':
      return resetAction();
    case 'ADD_STATE':
      return addStateAction(state);
    case 'DELETE_STATE':
      return deleteStateAction(state, action);
    case 'RENAME_STATE':
      return renameStateAction(state, action);
    case 'SET_EDGE':
      return setEdgeAction(state, action);
    case 'SET_INITIAL_STATE':
      return setInitialStateAction(state, action);
    case 'SET_FINAL_STATE':
      return setFinalStateAction(state, action);
    default:
      return state;
  }
}

function getNextStateNumber(states: DFAStates): number {
  return Object.values(states).reduce((nextStateNumber, state) => {
    const currentStateNumber = Number.parseInt(state.name);
    return Number.isNaN(currentStateNumber) ? nextStateNumber : Math.max(currentStateNumber + 1, nextStateNumber);
  }, 0)
}

/**
 * Convers a {@link DFA} to a {@link DFAEditorState}.
 *
 * @param dfa The DFA to convert.
 * @returns The DFA editor state.
 */
export function convertDFA(dfa: DFA): DFAEditorState {
  return ({
    dfaStates: Object.entries(dfa.getStates()).reduce<DFAStates>((acc, [id, state]) => ({
      ...acc,
      [id]: {
        name: state.name,
        final: state.final,
        edges: Object.values(state.edges).reduce<Edges>((acc, edge) => ({
          ...acc,
          [edge.letter.name]: edge.to,
        }), {}),
      }
    }), {}),
    initialStateID: dfa.getInitialState().id,
  });
}
