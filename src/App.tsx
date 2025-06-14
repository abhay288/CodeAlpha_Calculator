import React, { useState, useEffect, useRef } from 'react';
import { Delete, Plus, Minus, X, Divide, Equal } from 'lucide-react';

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
}

function App() {
  const [calc, setCalc] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
  });

  const calculatorRef = useRef<HTMLDivElement>(null);

  const inputNumber = (num: string) => {
    if (calc.waitingForNewValue) {
      setCalc({
        ...calc,
        display: num,
        waitingForNewValue: false,
      });
    } else {
      setCalc({
        ...calc,
        display: calc.display === '0' ? num : calc.display + num,
      });
    }
  };

  const inputDecimal = () => {
    if (calc.waitingForNewValue) {
      setCalc({
        ...calc,
        display: '0.',
        waitingForNewValue: false,
      });
    } else if (calc.display.indexOf('.') === -1) {
      setCalc({
        ...calc,
        display: calc.display + '.',
      });
    }
  };

  const clear = () => {
    setCalc({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
    });
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(calc.display);

    if (calc.previousValue === null) {
      setCalc({
        ...calc,
        previousValue: inputValue,
        operation: nextOperation,
        waitingForNewValue: true,
      });
    } else if (calc.operation) {
      const currentValue = calc.previousValue || 0;
      const newValue = calculate(currentValue, inputValue, calc.operation);

      setCalc({
        ...calc,
        display: String(newValue),
        previousValue: newValue,
        operation: nextOperation,
        waitingForNewValue: true,
      });
    }
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    if (calc.operation && calc.previousValue !== null) {
      const inputValue = parseFloat(calc.display);
      const newValue = calculate(calc.previousValue, inputValue, calc.operation);
      
      setCalc({
        display: String(newValue),
        previousValue: null,
        operation: null,
        waitingForNewValue: true,
      });
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      
      if (key >= '0' && key <= '9') {
        inputNumber(key);
      } else if (key === '.') {
        inputDecimal();
      } else if (key === '+') {
        performOperation('+');
      } else if (key === '-') {
        performOperation('-');
      } else if (key === '*') {
        performOperation('×');
      } else if (key === '/') {
        event.preventDefault();
        performOperation('÷');
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clear();
      } else if (key === 'Backspace') {
        if (calc.display.length > 1) {
          setCalc({
            ...calc,
            display: calc.display.slice(0, -1),
          });
        } else {
          setCalc({
            ...calc,
            display: '0',
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [calc]);

  const formatDisplay = (value: string): string => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    
    // Format large numbers with commas
    if (Math.abs(number) >= 1000) {
      return number.toLocaleString();
    }
    
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 bg-white/10 rounded-full animate-float-${i % 3}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div 
        ref={calculatorRef}
        className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-[1.02] transition-all duration-300"
      >
        <div className="w-80">
          {/* Display */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
            <div className="text-right">
              <div className="text-white/60 text-sm mb-1 h-4">
                {calc.previousValue !== null && calc.operation && (
                  <span>{calc.previousValue} {calc.operation}</span>
                )}
              </div>
              <div className="text-white text-4xl font-light tracking-wider break-all">
                {formatDisplay(calc.display)}
              </div>
            </div>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <button
              onClick={clear}
              className="col-span-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-4 px-6 rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-red-500/25"
            >
              Clear
            </button>
            <button
              onClick={() => {
                if (calc.display.length > 1) {
                  setCalc({
                    ...calc,
                    display: calc.display.slice(0, -1),
                  });
                } else {
                  setCalc({
                    ...calc,
                    display: '0',
                  });
                }
              }}
              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-semibold py-4 px-6 rounded-xl border border-orange-400/30 hover:border-orange-400/50 transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center"
            >
              <Delete size={20} />
            </button>
            <button
              onClick={() => performOperation('÷')}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold py-4 px-6 rounded-xl border border-blue-400/30 hover:border-blue-400/50 transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
            >
              <Divide size={20} />
            </button>

            {/* Row 2 */}
            <button
              onClick={() => inputNumber('7')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              7
            </button>
            <button
              onClick={() => inputNumber('8')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              8
            </button>
            <button
              onClick={() => inputNumber('9')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              9
            </button>
            <button
              onClick={() => performOperation('×')}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold py-4 px-6 rounded-xl border border-blue-400/30 hover:border-blue-400/50 transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
            >
              <X size={20} />
            </button>

            {/* Row 3 */}
            <button
              onClick={() => inputNumber('4')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              4
            </button>
            <button
              onClick={() => inputNumber('5')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              5
            </button>
            <button
              onClick={() => inputNumber('6')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              6
            </button>
            <button
              onClick={() => performOperation('-')}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold py-4 px-6 rounded-xl border border-blue-400/30 hover:border-blue-400/50 transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
            >
              <Minus size={20} />
            </button>

            {/* Row 4 */}
            <button
              onClick={() => inputNumber('1')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              1
            </button>
            <button
              onClick={() => inputNumber('2')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              2
            </button>
            <button
              onClick={() => inputNumber('3')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              3
            </button>
            <button
              onClick={() => performOperation('+')}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold py-4 px-6 rounded-xl border border-blue-400/30 hover:border-blue-400/50 transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
            >
              <Plus size={20} />
            </button>

            {/* Row 5 */}
            <button
              onClick={() => inputNumber('0')}
              className="col-span-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 hover:shadow-lg"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 font-semibold py-4 px-6 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center"
            >
              <Equal size={20} />
            </button>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="mt-6 text-center text-white/40 text-xs">
            Press keys to use calculator • ESC to clear
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;