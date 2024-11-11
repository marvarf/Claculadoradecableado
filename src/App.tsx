import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Group {
  id: number;
  values: number[];
  nodes: string[];
}

function findClosestSum(values: number[], target: number): number[] {
  let n = values.length;
  let bestSum = 0;
  let bestSubset: number[] = [];

  for (let i = 1; i < (1 << n); i++) {
    let subset: number[] = [];
    for (let j = 0; j < n; j++) {
      if ((i & (1 << j)) !== 0) {
        subset.push(values[j]);
      }
    }
    let subsetSum = subset.reduce((sum, value) => sum + value, 0);

    if (subsetSum <= target && subsetSum > bestSum) {
      bestSum = subsetSum;
      bestSubset = subset;
    }
  }

  return bestSubset;
}

function separateIntoGroups(values: number[], target: number): Group[] {
  let groups: Group[] = [];
  let remainingValues = values.slice();
  let id = 1;
  let nodes: string[] = [];

  for (let i = 0; i < values.length; i++) {
    nodes.push(`Nodo ${i + 1}`);
  }

  while (remainingValues.length > 0) {
    let subset = findClosestSum(remainingValues, target);
    let subsetNodes: string[] = [];

    for (let i = 0; i < subset.length; i++) {
      let index = values.indexOf(subset[i]);
      subsetNodes.push(nodes[index]);
      nodes.splice(index, 1);
      values.splice(index, 1);
    }

    groups.push({ id, values: subset, nodes: subsetNodes });
    remainingValues = remainingValues.filter(value => !subset.includes(value));
    id++;
  }

  return groups;
}

function App() {
  const [numValues, setNumValues] = useState('');
  const [values, setValues] = useState<number[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showValues, setShowValues] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState(false);
  const [errorNodes, setErrorNodes] = useState<string[]>([]);

  const handleCalculate = () => {
    const groups = separateIntoGroups(values, 305);
    setGroups(groups);
  };

  const handleNumValues = () => {
    setShowValues(true);
    setValues(new Array(parseInt(numValues)).fill(0));
  };

  const handleValueChange = (index: number, value: string) => {
    const newValue = parseInt(value);
    if (newValue > 100) {
      setError(true);
      setErrorNodes([...errorNodes, `Nodo ${index + 1}`]);
    } else {
      setErrorNodes(errorNodes.filter(node => node !== `Nodo ${index + 1}`));
      if (errorNodes.length === 0) {
        setError(false);
      }
    }
    setValues(values.map((v, i) => i === index ? newValue : v));
  };

  const handleWelcome = () => {
    setShowWelcome(false);
  };

  const handleReset = () => {
    setShowWelcome(true);
    setShowValues(false);
    setError(false);
    setErrorNodes([]);
    setGroups([]);
    setValues([]);
    setNumValues('');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {showWelcome && (
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-2xl font-bold">Bienvenido</h1>
          <p>Esta APP esta diseñada para calcular los metrajes a obtener de bobinas de cableado, para reducir la perdida de materiales</p>
          <button
            onClick={handleWelcome}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Continuar
          </button>
        </div>
      )}
      {!showWelcome && (
        <div>
          <div className="flex flex-col gap-4">
            <input
              type="number"
              value={numValues}
              onChange={e => setNumValues(e.target.value)}
              placeholder="Número de valores"
              className="p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleNumValues}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Siguiente
            </button>
          </div>
          {showValues && (
            <div className="flex flex-col gap-4 mt-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">Error: Los siguientes nodos tienen valores fuera de norma: {errorNodes.join(', ')}</span>
                </div>
              )}
              {values.map((value, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <label>Nodo {index + 1}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={e => handleValueChange(index, e.target.value)}
                    placeholder={`Metraje ${index + 1}`}
                    className={`p-2 border border-gray-300 rounded ${errorNodes.includes(`Nodo ${index + 1}`) ? 'border-red-500' : ''}`}
                  />
                  {errorNodes.includes(`Nodo ${index + 1}`) && (
                    <X className="text-red-500" />
                  )}
                </div>
              ))}
              <button
                onClick={handleCalculate}
                disabled={error}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Calcular
              </button>
              <button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Reset
              </button>
            </div>
          )}
          {groups.length > 0 && (
            <div className="flex flex-col gap-4 mt-4">
              {groups.map(group => (
                <div key={group.id} className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Bobina {group.id}</p>
                  <p>Nodos: {group.nodes.join(', ')}</p>
                  <p>Metrajes: {group.values.join(', ')} <Check className="text-green-500" /></p>
                </div>
              ))}
              <button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;