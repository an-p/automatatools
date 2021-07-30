import * as UUID from 'uuid';
import {Algorithm} from "./Algorithm";
import {DFA} from '../automata/DFA';
import {getMinDFATableCell, MinDFATable, setMinDFATableCell} from '../visualizations/MinDFATable';

/**
 * Maps the state IDs of the DFA to the state IDs of the minimal DFA.
 */
export type StateMap = { [oldStateID: string]: string };

type CombinedState = { id: string, name: string, final: boolean, initial: boolean, ids: string[] };
type CombinedStates = { [id: string]: CombinedState };

/**
 * The output of the DFA minimization algorithm.
 */
export type MinDFAOutput = {
  // A minimal DFA that is equivalent to the original DFA or undefined if the original DFA is already minimal.
  minDFA?: DFA;
  // Maps the state IDs of the DFA to the state IDs of the minimal DFA or undefined if the original DFA is already minimal.
  stateMap?: StateMap;
  // The final minimization table.
  table: MinDFATable;
}

/**
 * Minimizes a DFA by combining equivalent states.
 */
export class MinDFA implements Algorithm<MinDFAOutput, MinDFATable> {
  private readonly dfa: DFA;
  private readonly stateCount: number;
  private table: MinDFATable;
  private initialStep: boolean;

  constructor(dfa: DFA) {
    this.dfa = dfa;
    this.stateCount = Object.keys(this.dfa.getStates()).length;
    this.table = {};
    this.initialStep = true;
  }

  /**
   * Runs all remaining algorithm steps, then generates the output.
   *
   * @returns The output of the algorithm, see {@link MinDFAOutput}.
   */
  run(): MinDFAOutput {
    while (this.step()) {
    }

    const stateIDmap = Object.entries(this.dfa.getStates()).reduce<{ [id: string]: string[] }>(
      (acc, [id1, state1]) => ({
        ...acc,
        [id1]: Object.entries(this.dfa.getStates())
          .filter(([id2]) => id1 !== id2)
          .reduce<string[]>(
            (acc, [id2, state2]) => getMinDFATableCell(this.table, state1, state2)
              ? acc
              : acc.concat(id2).sort(),
            [id1]
          )
      }),
      {}
    );

    if (Object.values(stateIDmap).every((states) => states.length === 1)) {
      return {table: this.table};
    }

    const combinedStates: CombinedState[] = [];
    const stateMap = Object.entries(stateIDmap)
      .filter(([id, ids]) => ids[0] === id)
      .reduce<CombinedStates>((acc, [id, ids]) => {
        const combinedState = this.combineStates(id, this.dfa.getInitialState().id, stateIDmap);
        combinedStates.push(combinedState);
        return ids.reduce<CombinedStates>((acc, id) => ({...acc, [id]: combinedState}), acc);
      }, {});
    const initialState = combinedStates.find((state) => state.initial)!;
    const minDFA = new DFA({
      id: initialState.id,
      name: initialState.name,
      final: initialState.final
    }, this.dfa.getInputAlphabet());
    combinedStates
      .filter((state) => state.id !== initialState.id)
      .forEach((state) => minDFA.addState(state.id, state.name, state.final));
    combinedStates.forEach(
      (state) => Object.values(this.dfa.getStates()[state.ids[0]].edges).forEach(
        (edge) => minDFA.addEdge(state.id, stateMap[edge.to].id, edge.letter)
      )
    );

    return ({
      minDFA,
      stateMap: Object.entries(stateMap).reduce((acc, [id, state]) => ({...acc, [id]: state.id}), {}),
      table: this.table,
    })
  }

  /**
   * Compares all states with each other and adds entries to the table if they are not equivalent.
   *
   * @returns undefined if the table has not changed since the last step, the new {@link MinDFATable} otherwise.
   */
  step(): MinDFATable | undefined {
    let changed = false;

    for (let i = 1; i < this.stateCount; i++) {
      const state1 = Object.values(this.dfa.getStates())[i];
      for (let j = 0; j < i; j++) {
        const state2 = Object.values(this.dfa.getStates())[j];
        if (this.initialStep) {
          if (state1.final !== state2.final) {
            this.table = setMinDFATableCell(this.table, state1, state2, []);
            changed = true;
          }
        } else if (getMinDFATableCell(this.table, state1, state2) === undefined) {
          for (const letter of Array.from(this.dfa.getInputAlphabet().values())) {
            this.dfa.setCurrentState(state1);
            const newState1 = this.dfa.read(letter);
            this.dfa.setCurrentState(state2);
            const newState2 = this.dfa.read(letter);
            const word = getMinDFATableCell(this.table, newState1, newState2);
            if (word !== undefined) {
              this.table = setMinDFATableCell(this.table, state1, state2, [letter].concat(word));
              changed = true;
              break;
            }
          }
        }
      }
    }
    this.initialStep = false;

    return changed ? this.table : undefined
  }

  /**
   * Combines DFA states to get a state of the minimal DFA.
   *
   * @param id The ID of the original state.
   * @param initialStateID The initial state ID of the original DFA.
   * @param stateMap A map from the original DFA state IDs to the minimal DFA state IDs.
   *
   * @returns A state of the minimal DFA that represents the combination of all states equivalent to the state with the provided ID.
   * @private
   */
  private combineStates(id: string, initialStateID: string, stateMap: { [id: string]: string[] }): CombinedState {
    return {
      id: UUID.v4(),
      name: `{${stateMap[id].map((id) => this.dfa.getStates()[id].name).sort().join(', ')}}`,
      final: this.dfa.getStates()[id].final,
      initial: stateMap[id].includes(initialStateID),
      ids: stateMap[id],
    }
  }
}