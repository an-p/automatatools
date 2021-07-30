import * as UUID from 'uuid';

/**
 * A set of letters that make up an alphabet.
 */
export type Alphabet = Set<Letter>;

/**
 * A letter for use in alphabets.
 */
export type Letter = {
  /**
   * The UUID of the letter. Must be unique.
   */
  id: string;
  /**
   * Textual representation of the letter, usually a single character. Should be unique.
   */
  name: string;
}

/**
 * A sequence of letters that makes up a word.
 */
export type Word = Letter[];

/**
 * Creates a new letter from a string.
 *
 * @param name Textual representation of the letter.
 * @returns The new letter.
 */
export function createLetter(name: string): Letter {
  return ({name, id: UUID.v4()});
}

/**
 * Serializes a word. The empty word is serialized as 'ε'. A non-existent (undefined) word is serialized as ''.
 *
 * @param word The word to serialize.
 * @returns The serialized word.
 */
export function wordToString(word: Word | undefined): string {
  if (word === undefined) {
    return '';
  }
  return word.length ? word.reduce((str, letter) => `${str}${letter.name}`, '') : 'ε';
}