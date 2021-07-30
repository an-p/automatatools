import * as UUID from 'uuid';

import {Automaton, Edge, State} from './Automaton';
import {Alphabet, Letter} from '../base/Alphabet';

/**
 * A state of a DFA.
 */
export interface DFAState extends State<DFAEdge> {
  // Whether the state is an accepting state.
  final: boolean;
}

/**
 * An edge of a DFA.
 */
export type DFAEdge = Edge;

/**
 * A representation of a DFA.
 */
export class DFA extends Automaton<DFAState, DFAEdge> {
  /**
   * Initializes a new DFA.
   *
   * @param initialState The initial DFA state.
   * @param inputAlphabet The initial input alphabet.
   */
  constructor(initialState: { id: string, name: string, final: boolean }, inputAlphabet: Alphabet) {
    super({...initialState, edges: {}}, inputAlphabet);
  }

  /**
   * Adds a new state to the DFA.
   *
   * @param id The UUID of the new state.
   * @param name The name of the new state.
   * @param final Whether the new state is an accepting state.
   */
  public addState(id: string, name: string, final?: boolean): void {
    super._addState({
      id,
      name,
      final: !!final,
      edges: {},
    });
  }

  /**
   * Adds a new edge to the DFA.
   *
   * @param from The ID of the source state.
   * @param to The ID of the destination state.
   * @param letter The letter associated with the new edge.
   */
  public addEdge(from: string, to: string, letter: Letter): void {
    if (!this.states[from]) {
      throw new Error('Invalid from state.');
    }
    if (!this.states[to]) {
      throw new Error('Invalid to state.');
    }
    if (!super.getInputAlphabet().has(letter)) {
      throw new Error('Letter not in input alphabet.');
    }
    if (Object.values(this.states[from].edges).find((edge) => edge.letter === letter)) {
      throw new Error('A DFA state may not have multiple outgoing edges with the same letter.');
    }
    super._addEdge({
      letter,
      from,
      to,
      id: UUID.v4(),
    });
  }

  /**
   * Reads a letter and changes the current state accordingly.
   *
   * @param letter The letter to read.
   * @returns The new current state.
   */
  public read(letter: Letter): DFAState {
    if (!this.getInputAlphabet().has(letter)) {
      throw new Error('Letter not in input alphabet.');
    }
    const edge = Object.values(this.currentState.edges).find((edge) => edge.letter === letter);
    if (!edge) {
      throw new Error('Edge not defined. A DFA requires all edges to be defined.');
    }
    return this.states[edge.to];
  }

  /**
   * Resets the current state to the initial state.
   */
  public reset(): void {
    this.currentState = this.initialState;
  }

  /**
   * Sets the current state to the specified state.
   *
   * @param state The state that should become the new current state.
   */
  public setCurrentState(state: DFAState): void {
    if (!this.states[state.id]) {
      throw new Error('The DFA does not have this state.');
    }
    this.currentState = state;
  }
}