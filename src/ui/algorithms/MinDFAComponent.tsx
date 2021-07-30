import React from 'react';
import DFAInput from '../inputs/DFAInput';
import {MinDFA, MinDFAOutput} from '../../algorithms/MinDFA';
import {MinDFATable} from '../../visualizations/MinDFATable';
import MinDFATableComponent from '../visualizations/MinDFATableComponent';
import {createLetter} from '../../base/Alphabet';
import {DFA} from '../../automata/DFA';
import StateMapComponent from '../visualizations/StateMapComponent';
import DFATable from '../visualizations/DFATable';
import {convertDFA} from '../../state/DFAEditor';

const MinDFAComponent: React.FC = () => {
  const [dfa, setDFA] = React.useState<DFA | undefined>(undefined);
  const [algorithm, setAlgorithm] = React.useState<MinDFA | undefined>(undefined);
  const [table, setTable] = React.useState<MinDFATable | undefined>(undefined);
  const [done, setDone] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<MinDFAOutput | undefined>(undefined);

  // TODO: ensure all edges are defined
  return (
    <div>
      <DFAInput apply={((state) => {
        const initialState = state.dfaStates[state.initialStateID!];
        const inputAlphabet = new Set(Array.from(Object.values(state.dfaStates)
          .reduce<Set<string>>(((alphabet, state) => {
            Object.entries(state.edges)
              .filter(([, toID]) => toID)
              .forEach(([letter]) => alphabet.add(letter));
            return alphabet;
          }), new Set())).map((letter) => createLetter(letter)));
        const dfa = new DFA(
          {
            id: state.initialStateID!,
            name: initialState.name,
            final: initialState.final
          },
          inputAlphabet
        );
        Object.entries(state.dfaStates)
          .filter(([id]) => id !== state.initialStateID)
          .forEach(([id, state]) => {
            dfa.addState(id, state.name, state.final);
          });
        Object.entries(state.dfaStates).forEach(([fromID, state]) => {
          Object.entries(state.edges)
            .filter(([, toID]) => toID)
            .forEach(([letterName, toID]) => {
              dfa.addEdge(fromID, toID!, Array.from(inputAlphabet).find((letter) => letter.name === letterName)!);
            });
        });
        setDone(false);
        setDFA(dfa);
        setAlgorithm(new MinDFA(dfa));
        setTable(undefined);
        setResult(undefined);
      })}/>
      {dfa && <div className="section">
        <h2>DFA</h2>
        <DFATable state={convertDFA(dfa)} readonly/>
      </div>}
      {dfa && algorithm && <div className="section">
        <h2>Find equivalent states</h2>
        <button
          disabled={done}
          onClick={() => {
            try {
              const stepResult = algorithm.step();
              if (stepResult !== undefined) {
                setTable(stepResult);
              } else {
                setDone(true);
                const result = algorithm.run();
                setTable(result.table);
                setResult(result);
              }
            } catch (e) {
              alert(`Error: ${e.message}`);
            }
          }}
        >
          Step
        </button>
        {table && <MinDFATableComponent states={dfa.getStates()} table={table} done={done}/>}
      </div>}
      {result && !result.minDFA && <div className="section">
        <h2>Already minimal</h2>
      </div>}
      {dfa && result?.stateMap && result?.minDFA && <>
        <div className="section">
          <h2>Combine equivalent states</h2>
          <StateMapComponent stateMap={result.stateMap} dfa={dfa} newDFA={result.minDFA}/>
        </div>
        <div className="section">
          <h2>Minimal DFA</h2>
          <DFATable state={convertDFA(result.minDFA)} readonly/>
        </div>
      </>}
    </div>
  )
};

export default MinDFAComponent;
