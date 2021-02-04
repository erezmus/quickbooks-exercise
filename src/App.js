import { useEffect, useState } from "react";
import JsMoney from "js-money";
import "./App.css";

function App() {
  const useNumberInput = (initialValue) => {
    const CURRENCY = JsMoney.GBP;
    const [value, setValue] = useState(initialValue);
    const [displayValue, setDisplayValue] = useState("");

    // this could probably be better
    // you sometimes get an error with very large number
    const updateValue = (value) => {
      if (value.charAt(value.length - 1) === ".") {
        setDisplayValue(value);
        return;
      }

      const decimal = parseFloat(value.replace(/[^0-9.]/g, "")).toFixed(
        CURRENCY.decimal_digits
      );
      let numberValue = Number(decimal);

      if (isNaN(numberValue)) {
        numberValue = 0;
      }

      const pennyValue = JsMoney.fromDecimal(numberValue, CURRENCY);
      setValue(pennyValue.amount);
      setDisplayValue(`${pennyValue.toDecimal()}`);
    };

    return {
      value,
      updateValue,
      attrs: {
        type: "number",
        inputMode: "tel",
        value: displayValue,
        onChange: (event) => updateValue(event.target.value),
      },
    };
  };

  const { value: income, attrs: incomeAttrs } = useNumberInput(0);
  const { value: commissions, attrs: commissionsAttrs } = useNumberInput(0);
  const { value: construction, attrs: constructionAttrs } = useNumberInput(0);
  const { value: otherIncome, attrs: otherIncomeAttrs } = useNumberInput(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal((income + commissions + construction + otherIncome) / 100);
  }, [income, commissions, construction, otherIncome]);

  return (
    <div className="App">
      <div className="title">The Quickbooks Calculator</div>
      <div className="grid">
        <div className="col">
          <div className="input-group">
            <label>Income From Sales</label>
            <div className="input">
              <div className="currency">£</div>
              <input value={income} {...incomeAttrs}></input>
            </div>
          </div>
          <div className="input-group">
            <label>Commissions</label>
            <div className="input">
              <div className="currency">£</div>
              <input value={commissions} {...commissionsAttrs}></input>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="input-group">
            <label>Construction</label>
            <div className="input">
              <div className="currency">£</div>
              <input value={construction} {...constructionAttrs}></input>
            </div>
          </div>

          <div className="input-group">
            <label>Other Income</label>
            <div className="input">
              <div className="currency">£</div>
              <input value={otherIncome} {...otherIncomeAttrs}></input>
            </div>
          </div>
        </div>
        <div className="total">
          <div>Total</div>
          <div className="total-value">£{total}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
