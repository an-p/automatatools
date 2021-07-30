import React from 'react';
import {States} from '../../automata/Automaton';
import {DFAState} from '../../automata/DFA';
import {getMinDFATableCell, MinDFATable} from '../../visualizations/MinDFATable';
import {wordToString} from '../../base/Alphabet';

export type MinDFATableComponentProps = {
  states: States<DFAState>;
  table: MinDFATable;
  done: boolean;
}

function printWord(table: MinDFATable, state1: DFAState, state2: DFAState, done: boolean) {
  const emptyCellPlaceholder = done ? '=' : '';
  const str = wordToString(getMinDFATableCell(table, state1, state2));
  return str.length ? str : emptyCellPlaceholder;
}

const MinDFATableComponent: React.FC<MinDFATableComponentProps> = ({states, table, done}) => (
  <div>
    <table className="min-dfa-table">
      <thead>
      <tr>
        <th/>
        {Object.values(states).map((state2) => (<th key={state2.id}>{state2.name}</th>))}
      </tr>
      </thead>
      <tbody>
      {Object.values(states).map((state1, index1) => (
        <tr key={state1.id}>
          <th>{state1.name}</th>
          {Object.values(states).map((state2, index2) => (
            <td key={state2.id}>
              {index1 > index2 ? printWord(table, state1, state2, done) : '-'}
            </td>
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  </div>
);

export default MinDFATableComponent;
