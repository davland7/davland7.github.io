import { useState, useEffect, useRef } from "react";
import Chart, { type Point } from "chart.js/auto";
import { data } from "./data";
import { formatCurrency } from "../../utils";

const DATA_TO_SHOW = 5;

const FondsFTQ = () => {
  const chartInstanceRef = useRef<Chart>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [disable, setDisable] = useState(false);
  const [dataToShow, setDataToShow] = useState(DATA_TO_SHOW);

  const updateChartData = () => {
    const ctx = canvasRef.current?.getContext("2d");
    const reversedData = data.slice(0, dataToShow).reverse();
    const labels = reversedData.flatMap((entry) => [
      `31 Mai ${entry.year}`,
      `30 Novembre ${entry.year}`,
    ]);

    const values = reversedData.flatMap((entry) => [
      entry.may,
      entry.november,
    ]);

    values.filter(element => {
      if (element === null) {
        labels.pop();
        return values;
      }
    });

    if (ctx) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        data: {
          datasets: [
            {
              data: values,
              label: "Prix de l’action",
              fill: true,
              borderColor: "#ecc94b",
            },
          ],
          labels,
        },
        options: {
          responsive: true,
          scales: {
            y: {
              grid: { color: "#e2e8f0" },
              ticks: {
                callback: (value) => {
                  return formatCurrency(parseFloat(value as string), 'fr-CA', 'CAD');
                },
              },
            },
            x: {
              grid: { color: "#e2e8f0" },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Historique du prix d’une action",
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Prix : ${formatCurrency(context.parsed.y, 'fr-CA', 'CAD')}`;
                },
              },
            },
          },
        },
        type: "line",
      });
    }
  };

  useEffect(() => {
    updateChartData();
  }, [dataToShow]);

  const handleChartClick = () => {
    const lastData = data[dataToShow - 1];

    if (lastData) {
      addData(`30 Novembre ${lastData.year}`, lastData.november);
      setDataToShow((prevDataToShow) => prevDataToShow + DATA_TO_SHOW);
    } else {
      setDisable(true);
    }
  };

  const addData = (label: unknown, newData: number | [number, number] | Point | null) => {
    if (chartInstanceRef.current) {
      if (label && newData !== null) {
        if (chartInstanceRef.current.data.labels) {
          chartInstanceRef.current.data.labels.push(label);
        }
        chartInstanceRef.current.data.datasets.forEach((dataset) => {
          dataset.data.push(newData);
        });
        chartInstanceRef.current.update();
      }
    }
  };

  return (
    <div
      className="mt-12"
    >
      <canvas
        aria-hidden="true"
        id="chart"
        ref={canvasRef}
        role="img"
      />
      <button
        aria-label="Ajouter 5 ans"
        className="block w-full max-w-md mt-4 m-auto p-2 rounded bg-yellow-500 border border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:cursor-not-allowed text-black font-bold text-base"
        disabled={disable}
        type="button"
        onClick={handleChartClick}
      >
        Ajouter 5 ans
      </button>
      <table
        className="max-w-md mt-4 m-auto"
        id="data"
      >
        <caption
          className="my-4"
        >
          Historique du prix d’une action
        </caption>
        <thead>
          <tr>
            <th id="year" scope="col">Année</th>
            <th id="may" scope="col">31 mai</th>
            <th id="november" scope="col">30 novembre</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, dataToShow).map(({ year, may, november }, index) => {
            return (
              <tr key={index}>
                <td headers="year">{year}</td>
                <td headers="may">{formatCurrency(may, 'fr-CA', 'CAD')}</td>
                <td headers="november">{november && formatCurrency(november, 'fr-CA', 'CAD')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FondsFTQ;
