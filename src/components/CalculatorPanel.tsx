import React, { useState } from 'react';
import { ArrowLeft, Calculator } from 'lucide-react';

interface CalculatorPanelProps {
  onBack: () => void;
}

export const CalculatorPanel: React.FC<CalculatorPanelProps> = ({ onBack }) => {
  const [selectedMode, setSelectedMode] = useState<'basic' | 'quadratic' | 'matrix' | null>(null);
  const [basicInput, setBasicInput] = useState('');
  const [basicResult, setBasicResult] = useState('');
  const [quadraticInputs, setQuadraticInputs] = useState({ a: '', b: '', c: '' });
  const [quadraticResult, setQuadraticResult] = useState<string[]>([]);
  const [matrixInputs, setMatrixInputs] = useState({
    a11: '', a12: '', a21: '', a22: '',
    b11: '', b12: '', b21: '', b22: ''
  });
  const [matrixResult, setMatrixResult] = useState<{
    sum: number[][];
    product: number[][];
  } | null>(null);

  const handleBasicCalculate = () => {
    try {
      // Simple expression evaluator
      const expression = basicInput.replace(/\s+/g, '');
      const match = expression.match(/(\d+(?:\.\d+)?)([+\-*/])(\d+(?:\.\d+)?)/);
      
      if (!match) {
        setBasicResult('Invalid expression format. Use: number operator number');
        return;
      }

      const [, num1, operator, num2] = match;
      const n1 = parseFloat(num1);
      const n2 = parseFloat(num2);

      if (isNaN(n1) || isNaN(n2)) {
        setBasicResult('Invalid numbers');
        return;
      }

      let result: number;
      switch (operator) {
        case '+': result = n1 + n2; break;
        case '-': result = n1 - n2; break;
        case '*': result = n1 * n2; break;
        case '/': 
          if (n2 === 0) {
            setBasicResult('Error: Division by zero');
            return;
          }
          result = n1 / n2; 
          break;
        default:
          setBasicResult('Unsupported operator');
          return;
      }

      setBasicResult(`${n1} ${operator} ${n2} = ${result}`);
    } catch {
      setBasicResult('Calculation error');
    }
  };

  const handleQuadraticCalculate = () => {
    const a = parseFloat(quadraticInputs.a);
    const b = parseFloat(quadraticInputs.b);
    const c = parseFloat(quadraticInputs.c);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setQuadraticResult(['Please enter valid numbers for a, b, and c']);
      return;
    }

    if (a === 0) {
      setQuadraticResult(['Error: a cannot be zero (not a quadratic equation)']);
      return;
    }

    const discriminant = b * b - 4 * a * c;
    const results: string[] = [];

    results.push(`Equation: ${a}x² + ${b}x + ${c} = 0`);
    results.push(`Discriminant (D) = ${discriminant}`);

    if (discriminant > 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      results.push('Two distinct real roots:');
      results.push(`x₁ = ${root1.toFixed(4)}`);
      results.push(`x₂ = ${root2.toFixed(4)}`);
    } else if (discriminant === 0) {
      const root = -b / (2 * a);
      results.push('One repeated real root:');
      results.push(`x = ${root.toFixed(4)}`);
    } else {
      const realPart = -b / (2 * a);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
      results.push('Two complex roots:');
      results.push(`x₁ = ${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`);
      results.push(`x₂ = ${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`);
    }

    setQuadraticResult(results);
  };

  const handleMatrixCalculate = () => {
    const values = Object.values(matrixInputs).map(v => parseFloat(v));
    if (values.some(v => isNaN(v))) {
      setMatrixResult(null);
      alert('Please fill all matrix values with valid numbers');
      return;
    }

    const [a11, a12, a21, a22, b11, b12, b21, b22] = values;
    
    // Matrix Addition
    const sum = [
      [a11 + b11, a12 + b12],
      [a21 + b21, a22 + b22]
    ];

    // Matrix Multiplication
    const product = [
      [
        a11 * b11 + a12 * b21,
        a11 * b12 + a12 * b22
      ],
      [
        a21 * b11 + a22 * b21,
        a21 * b12 + a22 * b22
      ]
    ];

    setMatrixResult({ sum, product });
  };

  const handleBasicKeyPress = (key: string) => {
    if (key === 'C') {
      setBasicInput('');
      setBasicResult('');
    } else if (key === '=') {
      handleBasicCalculate();
    } else if (key === '⌫') {
      setBasicInput(prev => prev.slice(0, -1));
    } else {
      setBasicInput(prev => prev + key);
    }
  };

  const renderBasicCalculator = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-2">
        <input
          type="text"
          value={basicInput}
          onChange={(e) => setBasicInput(e.target.value)}
          className="col-span-4 px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white text-right text-xl"
          placeholder="Enter expression (e.g., 2 + 3)"
        />
        
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((key) => (
          <button
            key={key}
            onClick={() => handleBasicKeyPress(key)}
            className={`p-4 text-xl font-bold rounded ${
              ['/', '*', '-', '+', '='].includes(key)
                ? 'bg-blue-600 hover:bg-blue-700'
                : key === '='
                ? 'bg-green-600 hover:bg-green-700 col-span-2'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {key}
          </button>
        ))}
        
        <button
          onClick={() => handleBasicKeyPress('C')}
          className="p-4 bg-red-600 hover:bg-red-700 text-xl font-bold rounded col-span-2"
        >
          C
        </button>
        <button
          onClick={() => handleBasicKeyPress('⌫')}
          className="p-4 bg-yellow-600 hover:bg-yellow-700 text-xl font-bold rounded"
        >
          ⌫
        </button>
      </div>

      {basicResult && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <p className="text-2xl font-mono">{basicResult}</p>
        </div>
      )}
    </div>
  );

  const renderQuadraticCalculator = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Solve: ax² + bx + c = 0</h3>
        <p className="text-gray-400">Enter coefficients a, b, and c</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {(['a', 'b', 'c'] as const).map((coef) => (
          <div key={coef} className="text-center">
            <label className="block text-gray-300 mb-2">Coefficient {coef}</label>
            <input
              type="number"
              step="any"
              value={quadraticInputs[coef]}
              onChange={(e) => setQuadraticInputs(prev => ({ ...prev, [coef]: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white text-center text-xl"
              placeholder={coef === 'a' ? 'e.g., 1' : coef === 'b' ? 'e.g., -3' : 'e.g., 2'}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleQuadraticCalculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold text-lg"
      >
        Calculate Roots
      </button>

      {quadraticResult.length > 0 && (
        <div className="p-6 bg-gray-900/50 border border-gray-700 rounded space-y-2">
          <h3 className="font-bold text-lg mb-3">Solution:</h3>
          {quadraticResult.map((line, index) => (
            <p key={index} className="font-mono text-gray-300">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  const renderMatrixCalculator = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">2×2 Matrix Operations</h3>
        <p className="text-gray-400">Enter values for matrices A and B</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Matrix A */}
        <div className="space-y-4">
          <h4 className="font-bold text-center text-blue-400">Matrix A</h4>
          <div className="grid grid-cols-2 gap-2">
            {(['a11', 'a12', 'a21', 'a22'] as const).map((cell) => (
              <input
                key={cell}
                type="number"
                step="any"
                value={matrixInputs[cell]}
                onChange={(e) => setMatrixInputs(prev => ({ ...prev, [cell]: e.target.value }))}
                className="px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white text-center"
                placeholder={cell.replace('a', '')}
              />
            ))}
          </div>
          <div className="text-center">
            <div className="inline-block bg-gray-800 p-2 rounded">
              <table className="border-collapse">
                <tbody>
                  <tr>
                    <td className="border border-gray-600 p-2">{matrixInputs.a11 || 'a11'}</td>
                    <td className="border border-gray-600 p-2">{matrixInputs.a12 || 'a12'}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-600 p-2">{matrixInputs.a21 || 'a21'}</td>
                    <td className="border border-gray-600 p-2">{matrixInputs.a22 || 'a22'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Matrix B */}
        <div className="space-y-4">
          <h4 className="font-bold text-center text-green-400">Matrix B</h4>
          <div className="grid grid-cols-2 gap-2">
            {(['b11', 'b12', 'b21', 'b22'] as const).map((cell) => (
              <input
                key={cell}
                type="number"
                step="any"
                value={matrixInputs[cell]}
                onChange={(e) => setMatrixInputs(prev => ({ ...prev, [cell]: e.target.value }))}
                className="px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white text-center"
                placeholder={cell.replace('b', '')}
              />
            ))}
          </div>
          <div className="text-center">
            <div className="inline-block bg-gray-800 p-2 rounded">
              <table className="border-collapse">
                <tbody>
                  <tr>
                    <td className="border border-gray-600 p-2">{matrixInputs.b11 || 'b11'}</td>
                    <td className="border border-gray-600 p-2">{matrixInputs.b12 || 'b12'}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-600 p-2">{matrixInputs.b21 || 'b21'}</td>
                    <td className="border border-gray-600 p-2">{matrixInputs.b22 || 'b22'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleMatrixCalculate}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded font-semibold text-lg"
      >
        Calculate A + B and A × B
      </button>

      {matrixResult && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-center text-blue-400">A + B</h4>
            <div className="text-center">
              <div className="inline-block bg-gray-800 p-4 rounded">
                <table className="border-collapse">
                  <tbody>
                    {matrixResult.sum.map((row, i) => (
                      <tr key={i}>
                        {row.map((val, j) => (
                          <td key={j} className="border border-gray-600 p-3 text-xl">
                            {val.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-center text-green-400">A × B</h4>
            <div className="text-center">
              <div className="inline-block bg-gray-800 p-4 rounded">
                <table className="border-collapse">
                  <tbody>
                    {matrixResult.product.map((row, i) => (
                      <tr key={i}>
                        {row.map((val, j) => (
                          <td key={j} className="border border-gray-600 p-3 text-xl">
                            {val.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Editor
          </button>
          <h1 className="text-3xl font-bold font-mono">🧮 Calculator Suite</h1>
          <div className="w-32"></div> {/* Spacer */}
        </div>

        {/* Mode Selection */}
        {!selectedMode && (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div 
              className="bg-blue-900/30 border border-blue-700 rounded-xl p-8 cursor-pointer hover:scale-105 transition-all"
              onClick={() => setSelectedMode('basic')}
            >
              <div className="flex flex-col items-center">
                <Calculator className="w-16 h-16 mb-4 text-blue-400" />
                <h2 className="text-2xl font-bold mb-2">Basic Calculator</h2>
                <p className="text-gray-300 text-center">Simple arithmetic operations</p>
              </div>
            </div>

            <div 
              className="bg-green-900/30 border border-green-700 rounded-xl p-8 cursor-pointer hover:scale-105 transition-all"
              onClick={() => setSelectedMode('quadratic')}
            >
              <div className="flex flex-col items-center">
                <Calculator className="w-16 h-16 mb-4 text-green-400" />
                <h2 className="text-2xl font-bold mb-2">Quadratic Solver</h2>
                <p className="text-gray-300 text-center">Solve ax² + bx + c = 0</p>
              </div>
            </div>

            <div 
              className="bg-purple-900/30 border border-purple-700 rounded-xl p-8 cursor-pointer hover:scale-105 transition-all"
              onClick={() => setSelectedMode('matrix')}
            >
              <div className="flex flex-col items-center">
                <Calculator className="w-16 h-16 mb-4 text-purple-400" />
                <h2 className="text-2xl font-bold mb-2">Matrix Calculator</h2>
                <p className="text-gray-300 text-center">2×2 matrix operations</p>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Content */}
        {selectedMode && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => setSelectedMode(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center"
              >
                ← Back to Calculators
              </button>
              
              <div className="flex items-center gap-2">
                {selectedMode === 'basic' && <Calculator className="w-6 h-6" />}
                {selectedMode === 'quadratic' && <Calculator className="w-6 h-6" />}
                {selectedMode === 'matrix' && <Calculator className="w-6 h-6" />}
                <h2 className="text-2xl font-bold">
                  {selectedMode === 'basic' && 'Basic Calculator'}
                  {selectedMode === 'quadratic' && 'Quadratic Equation Solver'}
                  {selectedMode === 'matrix' && 'Matrix Calculator'}
                </h2>
              </div>
              
              <div className="w-32"></div> {/* Spacer */}
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              {selectedMode === 'basic' && renderBasicCalculator()}
              {selectedMode === 'quadratic' && renderQuadraticCalculator()}
              {selectedMode === 'matrix' && renderMatrixCalculator()}
            </div>

            {/* History/Instructions */}
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/30 p-6 rounded-lg">
                <h3 className="font-bold mb-3">📝 Instructions</h3>
                <ul className="space-y-2 text-gray-300">
                  {selectedMode === 'basic' && (
                    <>
                      <li>• Use number keys and operators (+, -, *, /)</li>
                      <li>• Press = to calculate</li>
                      <li>• Press C to clear</li>
                      <li>• Example: 45 * 3.14</li>
                    </>
                  )}
                  {selectedMode === 'quadratic' && (
                    <>
                      <li>• Enter coefficients a, b, and c</li>
                      <li>• For complex roots, discriminant will be negative</li>
                      <li>• a cannot be zero</li>
                      <li>• Example: a=1, b=-3, c=2 gives roots 1 and 2</li>
                    </>
                  )}
                  {selectedMode === 'matrix' && (
                    <>
                      <li>• Fill all 8 values (4 for A, 4 for B)</li>
                      <li>• Results show A+B and A×B</li>
                      <li>• Matrix multiplication is not commutative</li>
                      <li>• Use decimal numbers as needed</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-gray-800/30 p-6 rounded-lg">
                <h3 className="font-bold mb-3">💡 Tips</h3>
                <ul className="space-y-2 text-gray-300">
                  {selectedMode === 'basic' && (
                    <>
                      <li>• Use . for decimal points</li>
                      <li>• Follow PEMDAS order of operations</li>
                      <li>• Clear errors with C button</li>
                    </>
                  )}
                  {selectedMode === 'quadratic' && (
                    <>
                      <li>• Roots can be real or complex</li>
                      <li>• Discriminant determines root type</li>
                      <li>• Vertex is at x = -b/(2a)</li>
                    </>
                  )}
                  {selectedMode === 'matrix' && (
                    <>
                      <li>• A+B adds corresponding elements</li>
                      <li>• A×B uses dot product of rows and columns</li>
                      <li>• A×B ≠ B×A in general</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};