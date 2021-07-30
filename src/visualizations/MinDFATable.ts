import {DFAState} from '../automata/DFA';
import {Word} from '../base/Alphabet';

/**
 * The table used by the {@link MinDFA} algorithm to find equivalent states.
 * Maps 2 state IDs to a {@link Word}.
 */
export type MinDFATable = { [index: string]: Word };

/**
 * Calculates the index from 2 state IDs.
 *
 * @param id1 The ID of the first state.
 * @param id2 The ID of the second state.
 * @returns The index that can be used to access the value in the table.
 */
export function minDFATableIndex(id1: string, id2: string): string {
  return id1 <= id2 ? `${id1};${id2}` : `${id2};${id1}`;
}

/**
 * Sets a word in the table.
 *
 * @param table The (immutable) table.
 * @param state1 The first DFA state.
 * @param state2 The second DFA state.
 * @param word The new word.
 * @returns The modified table.
 */
export function setMinDFATableCell(table: MinDFATable, state1: DFAState, state2: DFAState, word: Word): MinDFATable {
  return {...table, [minDFATableIndex(state1.id, state2.id)]: word};
}

/**
 * Gets a word from the table.
 *
 * @param table The table.
 * @param state1 The first DFA state.
 * @param state2 The second DFA state.
 * @returns The word that is in the table for the 2 specified states or undefined if there is no such word.
 */
export function getMinDFATableCell(table: MinDFATable, state1: DFAState, state2: DFAState): Word | undefined {
  return table[minDFATableIndex(state1.id, state2.id)];
}
