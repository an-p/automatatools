import React from 'react';
import {StateMap} from '../../algorithms/MinDFA';
import {DFA} from '../../automata/DFA';

export type StateMapComponentProps = {
  stateMap: StateMap;
  dfa: DFA;
  newDFA: DFA;
};

const StateMapComponent: React.FC<StateMapComponentProps> = ({stateMap, dfa, newDFA}) => (
  <table>
    <thead>
    <tr>
      <th>State</th>
      <th>New State</th>
    </tr>
    </thead>
    <tbody>
    {Object.entries(stateMap).map(([id, newID]) => (
      <tr key={id}>
        <td>{dfa.getStates()[id].name}</td>
        <td>{newDFA.getStates()[newID].name}</td>
      </tr>
    ))}
    </tbody>
  </table>
);

export default StateMapComponent;
