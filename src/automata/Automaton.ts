import {Alphabet, Letter} from '../base/Alphabet';

/**
 * A state of an automaton.
 */
export interface State<E extends Edge> {
  // The UUID of the state.
  id: string;
  // The name of the state.
  name: string;
  // All edges that originate from this state.
  edges: Edges<E>;
}

/**
 * An edge of an automaton.
 */
export interface Edge {
  // The UUID of the edge.
  id: string;
  // The ID of the source state.
  from: string;
  // The ID of the destination state.
  to: string;
  // The letter associated with this edge.
  letter: Letter;
}

/**
 * Maps state IDs to states.
 */
export type States<S> = { [id: string]: S };
/**
 * Maps edge IDs to edges.
 */
export type Edges<E> = { [id: string]: E };

/**
 * An abstract representation of an automaton.
 */
export abstract class Automaton<S extends State<E>, E extends Edge> {
  protected states: States<S>;
  protected readonly initialState: S;
  protected currentState: S;
  private readonly inputAlphabet: Alphabet;

  /**
   * Initializes a new automaton.
   *
   * @param initialState The initial state.
   * @param inputAlphabet The input alphabet.
   * @protected
   */
  protected constructor(initialState: S, inputAlphabet: Alphabet) {
    this.states = {[initialState.id]: initialState};
    this.initialState = initialState;
    this.currentState = initialState;
    this.inputAlphabet = inputAlphabet;
  }

  /**
   * Adds a state to the automaton. Does not perform any validation.
   *
   * @param state The state to add.
   */
  protected _addState(state: S): void {
    this.states[state.id] = state;
  }

  /**
   * Adds an edge to the automaton. Does not perform any validation.
   *
   * @param edge The edge to add.
   */
  protected _addEdge(edge: E): void {
    this.states[edge.from].edges[edge.id] = edge;
  }

  /**
   * Gets all states of the automaton.
   *
   * @returns All states.
   */
  public getStates(): States<S> {
    return this.states;
  }

  /**
   * Gets the initial state of the automaton.
   *
   * @returns The initial state.
   */
  public getInitialState(): S {
    return this.initialState;
  }

  /**
   * Gets the input alphabet of the automaton.
   *
   * @returns The input alphabet.
   */
  public getInputAlphabet(): Alphabet {
    return this.inputAlphabet;
  }
}