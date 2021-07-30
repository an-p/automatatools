import React from 'react';

type ToolLinkProps = {
  name: string;
  url: string;
  description: string;
}

const ToolLink: React.FC<ToolLinkProps> = ({name, url, description}) => (
  <li>
    <a href={url} rel="noreferrer" target="_blank">{name}</a>: {description}
  </li>
);

const ToolLinks: React.FC = () => (
  <>
    <h2>Automata</h2>
    <ul>
      <ToolLink
        name="Automaton Simulator"
        url="https://automatonsimulator.com/"
        description="Simulate DFAs, NFAs and PDAs"
      />
      <ToolLink
        name="Turing machine visualization"
        url="https://turingmachine.io/"
        description="Simulate TMs"
      />
    </ul>

    <h2>Formal grammars</h2>
    <ul>
      <ToolLink
        name="CFG Developer"
        url="https://web.stanford.edu/class/archive/cs/cs103/cs103.1156/tools/cfg/"
        description="Test context free grammars"
      />
      <ToolLink
        name="CYK Algorithm"
        url="https://www.xarg.org/tools/cyk-algorithm/"
        description="Decide the word-problem for context-free grammars (step-by-step)"
      />
      <ToolLink
        name="CFG to CNF"
        url="https://cyberzhg.github.io/toolbox/cfg2cnf"
        description="Convert context free grammars to Chomsky normal form"
      />
    </ul>

    <h2>Regular expressions</h2>
    <ul>
      <ToolLink
        name="regex101"
        url="https://regex101.com/"
        description="Regex tester"
      />
      <ToolLink
        name="Regex Equivalence"
        url="https://regex-equality.herokuapp.com/"
        description="Find out if two regular expressions match the same language"
      />
      <ToolLink
        name="Regex => NFA => DFA => Min-DFA"
        url="https://cyberzhg.github.io/toolbox/min_dfa"
        description="Convert regex to DFA"
      />
    </ul>
  </>
);

export default ToolLinks;