import {DFAEditorState} from '../../state/DFAEditor';
import React from 'react';

export type DFATableProps = {
  state: DFAEditorState;
  readonly?: boolean;
  renameState?: (id: string, newName: string) => void;
  setInitialState?: (id: string) => void;
  setFinalState?: (id: string, final: boolean) => void;
  setEdge?: (fromID: string, letter: string, toID?: string) => void;
  deleteState?: (id: string) => void;
}

const DFATable: React.FC<DFATableProps> = (
  {
    state: {dfaStates: states, initialStateID},
    readonly,
    renameState,
    setInitialState,
    setFinalState,
    setEdge,
    deleteState,
  }
) => {
  const alphabet = Array.from(Object.values(states).reduce<Set<string>>((acc, state) => {
    Object.entries(state.edges)
      .filter(([, toStateID]) => toStateID)
      .forEach(([letter,]) => acc.add(letter));
    return acc;
  }, new Set()));

  return !Object.entries(states).length ? null : (
    <table>
      <thead>
      <tr>
        <th rowSpan={2}>State</th>
        <th rowSpan={2}>Initial</th>
        <th rowSpan={2}>Final</th>
        <th colSpan={alphabet.length + (readonly ? 0 : 1)}>Transitions</th>
      </tr>
      <tr>
        {alphabet.map(((letter, index) => (<th key={index}>{letter}</th>)))}
        {!readonly && <th/>}
      </tr>
      </thead>
      <tbody>
      {Object.entries(states).map(([id, state]) => (
        <tr key={id}>
          <td>
            {readonly ? state.name : <button onClick={() => {
              const newName = prompt(`Rename state "${state.name}" (delete the name to remove the state)`, state.name);
              if (newName === null) {
                return;
              }
              if (!newName.length) {
                if (deleteState)
                  deleteState(id);
                return;
              }
              if (renameState)
                renameState(id, newName);
            }}>{state.name}</button>}
          </td>
          <td>
            <input type="radio" checked={id === initialStateID} disabled={readonly} onChange={(e) => {
              if (e.currentTarget.checked && setInitialState) {
                setInitialState(id);
              }
            }}/>
          </td>
          <td>
            <input type="checkbox" checked={state.final} disabled={readonly} onChange={(e) => {
              if (setFinalState)
                setFinalState(id, e.currentTarget.checked);
            }}/>
          </td>
          {alphabet.map((letter, index) => {
            const currentToStateID = state.edges[letter];
            return (
              <td key={index}>
                {readonly ? (currentToStateID ? states[currentToStateID].name : '-') : <select
                  value={currentToStateID || '-'}
                  onChange={(e) => {
                    if (setEdge)
                      setEdge(id, letter, e.currentTarget.value === '-' ? undefined : e.currentTarget.value);
                  }}
                >
                  <option value="-">-</option>
                  {Object.entries(states).map(([toStateID, toState]) => (
                    <option value={toStateID} key={toStateID}>{toState.name}</option>
                  ))}
                </select>}
              </td>
            );
          })}
          {!readonly && <td>
            <button onClick={() => {
              const letter = prompt(`Transition from state "${state.name}" with letter`);
              if (letter === null) {
                return;
              }
              if (letter.length !== 1) {
                alert(`Invalid letter "${letter}" (length must be 1).`);
                return;
              }
              const toStateName = prompt(`Transition from state "${state.name}" with letter "${letter}" to state`);
              if (toStateName === null || !toStateName.length) {
                return;
              }
              const toState = Object.entries(states).find(([, toState]) => toState.name === toStateName);
              if (!toState) {
                alert(`The state "${toStateName}" does not exist.`);
                return;
              }
              if (setEdge)
                setEdge(id, letter, toState[0]);
            }}>
              New
            </button>
          </td>}
        </tr>
      ))}
      </tbody>
    </table>
  )
};

export default DFATable;
