import { useMemo, useState } from 'react'
import './App.css'

const operators = [
  { label: '+', value: '+' },
  { label: '−', value: '-' },
  { label: '×', value: '×' },
  { label: '÷', value: '÷' },
]

const numberButtons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0']

const isNumeric = (value) => Number.isFinite(Number(value))

const formatResult = (value) => {
  if (!Number.isFinite(value)) return 'Error'
  const fixed = Number(value.toFixed(10))
  return fixed.toString()
}

const performOperation = (first, second, operator) => {
  switch (operator) {
    case '+':
      return first + second
    case '-':
      return first - second
    case '×':
      return first * second
    case '÷':
      return second === 0 ? null : first / second
    default:
      return second
  }
}

function App() {
  const [display, setDisplay] = useState('0')
  const [storedValue, setStoredValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [overwrite, setOverwrite] = useState(true)

  const expressionPreview = useMemo(() => {
    if (storedValue === null || !operator) return ''
    return `${formatResult(storedValue)} ${operator}`
  }, [storedValue, operator])

  const resetCalculator = () => {
    setDisplay('0')
    setStoredValue(null)
    setOperator(null)
    setOverwrite(true)
  }

  const handleDigit = (digit) => {
    if (!isNumeric(display) || overwrite) {
      setDisplay(digit)
      setOverwrite(false)
      return
    }

    setDisplay((current) => {
      if (current === '0') return digit
      return current + digit
    })
    setOverwrite(false)
  }

  const handleDecimal = () => {
    if (!isNumeric(display) || overwrite) {
      setDisplay('0.')
      setOverwrite(false)
      return
    }

    setDisplay((current) => (current.includes('.') ? current : `${current}.`))
  }

  const handleOperator = (nextOperator) => {
    if (!isNumeric(display)) {
      setStoredValue(0)
      setOperator(nextOperator)
      setDisplay('0')
      setOverwrite(true)
      return
    }

    const currentValue = Number(display)

    if (storedValue !== null && operator && !overwrite) {
      const result = performOperation(storedValue, currentValue, operator)
      if (result === null) {
        setDisplay('Cannot divide by zero')
        setStoredValue(null)
        setOperator(null)
        setOverwrite(true)
        return
      }

      const formatted = formatResult(result)
      setStoredValue(result)
      setDisplay(formatted)
    } else {
      setStoredValue(currentValue)
    }

    setOperator(nextOperator)
    setOverwrite(true)
  }

  const handleEquals = () => {
    if (operator === null || storedValue === null || !isNumeric(display)) {
      return
    }

    const currentValue = Number(display)
    const result = performOperation(storedValue, currentValue, operator)

    if (result === null) {
      setDisplay('Cannot divide by zero')
      setStoredValue(null)
      setOperator(null)
      setOverwrite(true)
      return
    }

    setDisplay(formatResult(result))
    setStoredValue(null)
    setOperator(null)
    setOverwrite(true)
  }

  const handleDelete = () => {
    if (overwrite || !isNumeric(display)) {
      setDisplay('0')
      setOverwrite(true)
      return
    }

    setDisplay((current) => {
      if (current.length <= 1) return '0'
      return current.slice(0, -1)
    })
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">React playground</p>
          <h1>Basic calculator</h1>
          <p className="lede">
            A straightforward calculator that handles addition, subtraction, multiplication,
            and division without distracting chrome.
          </p>
        </div>
        <button className="clear" type="button" onClick={resetCalculator}>
          Reset
        </button>
      </header>

      <div className="calculator">
        <div className="calculator__display" aria-live="polite" aria-atomic="true">
          <div className="calculator__preview">{expressionPreview}</div>
          <div className="calculator__current">{display}</div>
        </div>

        <div className="calculator__actions">
          <button type="button" className="action" onClick={resetCalculator}>
            AC
          </button>
          <button type="button" className="action" onClick={handleDelete}>
            DEL
          </button>
          <button type="button" className="action" onClick={handleDecimal}>
            .
          </button>
          {operators.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              className={`operator${value === operator ? ' operator--active' : ''}`}
              onClick={() => handleOperator(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="calculator__pad">
          {numberButtons.map((number) => (
            <button key={number} type="button" onClick={() => handleDigit(number)}>
              {number}
            </button>
          ))}
          <button className="equals" type="button" onClick={handleEquals}>
            =
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
