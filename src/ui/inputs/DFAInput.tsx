import React from 'react';
import DFATable from '../visualizations/DFATable';
import {DFAEditorReducer, DFAEditorState, initialDFAEditorState} from '../../state/DFAEditor';

export type DFAInputProps = {
  apply: (state: DFAEditorState) => void;
}

const DFAInput: React.FC<DFAInputProps> = ({apply}) => {
  const [state, dispatch] = React.useReducer(DFAEditorReducer, initialDFAEditorState);

  return (
    <div className="section">
      <h2>Edit DFA</h2>
      <div>
        <button onClick={() => dispatch({type: 'ADD_STATE'})}>
          Add State
        </button>
        <button
          disabled={!state.initialStateID || !Object.keys(state.dfaStates).length}
          onClick={() => apply(state)}
        >
          Apply
        </button>
        <button onClick={() => {
          if(window.confirm('Reset DFA?')) {
            dispatch({type: 'RESET'});
          }
        }}>Reset</button>
      </div>
      <div>
        <DFATable
          state={state}
          renameState={((id, newName) => dispatch({type: 'RENAME_STATE', id, newName}))}
          setInitialState={(id) => dispatch({type: 'SET_INITIAL_STATE', id})}
          setFinalState={(id, final) => dispatch({type: 'SET_FINAL_STATE', id, final})}
          setEdge={((fromID, letter, toID) => dispatch({type: 'SET_EDGE', fromID, letter, toID}))}
          deleteState={(id) => dispatch({type: 'DELETE_STATE', id})}
        />
      </div>
    </div>
  );
};

export default DFAInput;
