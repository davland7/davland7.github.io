import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '../../utils';

interface CurrenciesProps {
  code: string;
  currencies: {
    CAD: number;
    CHF: number;
    CNY: number;
    EUR: number;
    GBP: number;
    JPY: number;
    USD: number;
  };
  name: string;
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [codeCurrency, setCodeCurrency] = useState<string>('CAD');
  const [currencies, setCurrencies] = useState<CurrenciesProps[]>([]);

  const controller = new AbortController();

  useEffect(() => {
    async function getData() {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbwm9fIfCs5QrGVlescxZw599Wm5HD37pIPlU5i54gvIegJk_nbwKaazIeAx23HVsRtWAQ/exec',
        { signal: controller.signal }
      );
      const data = await response.json();
      setCurrencies(data);
    }

    getData();

    return () => {
      controller.abort();
    };
  }, []);

  const currencyMap = useMemo(() => {
    const map = new Map();
    currencies.forEach(currency => map.set(currency.code, currency));
    return map;
  }, [currencies]);

  const getCurrencies = useMemo(() => {
    const selectedCurrency = currencyMap.get(codeCurrency);
    if (!selectedCurrency) return [];

    return Array.from(currencyMap.values()).map(currency => ({
      code: currency.code,
      name: currency.name,
      value: selectedCurrency.currencies[currency.code] || 0
    }));
  }, [codeCurrency, currencyMap]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setCodeCurrency((e.target as HTMLTableRowElement).cells[1]?.textContent ?? '');
    }
  }

  return (
    <div className="w-full max-w-md my-12 m-auto">
      <table className="w-full min-h-[457px]">
        <thead>
          <tr>
            <th id="name" className="px-2 py-4 border border-black dark:border-white">Nom</th>
            <th id="code" className="px-2 py-4 border border-black dark:border-white">Code</th>
            <th id="value" className="px-2 py-4 border border-black dark:border-white">Valeur</th>
          </tr>
        </thead>
        <tbody>
        {getCurrencies.map(({value, name, code}, i) => (
          <tr
            role="button"
            tabIndex={0}
            key={i}
            className={`cursor-pointer ${code === codeCurrency ? 'bg-yellow-500 dark:text-black' : ''} `}
            onClick={() => setCodeCurrency(code)}
            onKeyDown={handleKeyDown}
          >
            <td headers="name" className="px-2 py-4 border border-black dark:border-white">{name}</td>
            <td headers="code" className="px-2 py-4 border border-black dark:border-white">{code}</td>
            <td headers="value" className="px-2 py-4 border border-black dark:border-white">{formatCurrency(value * amount, 'fr-CA', code, 10)}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <p className="mt-4">
        <label
          className="block mb-2"
          htmlFor="amount">
            Montant
        </label>
        <input
          aria-label="Montant"
          className="w-full mt-4 p-2 rounded bg-inherit text-inherit"
          id="amount"
          name="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat((e.target as HTMLInputElement).value))}
        />
      </p>
    </div>
  );
};

export default CurrencyConverter;
