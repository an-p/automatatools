import React from 'react';

export type StateInputProps = {
  addState: (name: string, final: boolean) => void;
}

const StateInput: React.FC<StateInputProps> = ({addState}) => {
  const [name, setName] = React.useState<string>('');
  const [final, setFinal] = React.useState<boolean>(false);

  return (
    <div>
      <div>
        <input type="text" value={name} onChange={(e) => setName(e.currentTarget.value)}/>
      </div>
      <div>
        <label>Final</label>
        <input type="checkbox" checked={final} onChange={(e) => setFinal(e.currentTarget.checked)}/>
      </div>
      <div>
        <button onClick={() => {
          addState(name, final);
          setName('');
          setFinal(false);
        }}>Add
        </button>
      </div>
    </div>
  );
}

export default StateInput;
