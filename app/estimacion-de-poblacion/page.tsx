'use client';

import React from 'react';
import Button from '#/ui/button';
import { PrefabTable, PrefabTableProps } from '#/ui/tabletable';
import {
  checkIfIsValidNumber,
  checkIfIsValidPercentage,
} from '#/utils/validators';
import { Boundary } from '#/ui/boundary';
import ErrorMessage from '#/ui/error-message';
import { Loader } from '#/ui/loader';

export default function Page() {
  const [lastYear, setLastYear] = React.useState('');
  const [startYear, setStartYear] = React.useState('');
  const [initPopulation, setInitPopulation] = React.useState('');
  const [natalityRate, setNatalityRate] = React.useState('');
  const [mortalityRate, setMortalityRate] = React.useState('');
  const [tableData, setTableData] = React.useState({
    rows: [],
    columns: [],
  } as PrefabTableProps);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    setError('');
    setLoading(true);
    e.preventDefault(); // Prevent page reload

    const payload = {
      startYear,
      lastYear,
      initPopulation,
      natalityRate,
      mortalityRate,
    };

    try {
      const response = await fetch('/api/simulate/estimacion-de-poblacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTableData({
          rows: data.rows,
          columns: data.columns,
        }); // Update table with response data
      } else {
        console.error('Error: Failed to fetch data');
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(String(error));
    }
    setLoading(false);
  };

  const handleReset = () => {
    setLastYear('');
    setStartYear('');
    setInitPopulation('');
    setNatalityRate('');
    setMortalityRate('');
    setTableData({
      rows: [],
      columns: [],
    });
    setError('');
  };

  const renderTable = () => {
    if (loading) return Loader();
    else if (error != '') return ErrorMessage(error);
    else if (tableData?.rows.length > 0 && tableData?.columns.length > 0)
      return (
        <PrefabTable rows={tableData?.rows} columns={tableData?.columns} />
      );
    else return <p>No data to show...</p>;
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Estimación de Población</h1>
      <div className="grid md:grid-cols-3">
        <div className="col-span-2 flex gap-2">
          <Boundary labels={['Simulation Parameters']} size="small">
            <form onSubmit={handleSubmit}>
              <input
                className="m-2 text-black"
                name="startYear"
                placeholder="Año inicial"
                value={startYear}
                onChange={(e) => checkIfIsValidNumber(e, setStartYear)}
              />
              <input
                className="m-2 text-black"
                name="lastYear"
                placeholder="Año final"
                value={lastYear}
                onChange={(e) => checkIfIsValidNumber(e, setLastYear)}
              />
              <input
                className="m-2 text-black"
                name="initPopulation"
                placeholder="Población inicial (hab)"
                value={initPopulation}
                onChange={(e) => checkIfIsValidNumber(e, setInitPopulation)}
              />
              <input
                className="m-2 text-black"
                name="natalityRate"
                placeholder="Natality Rate (%)"
                value={natalityRate}
                onChange={(e) => checkIfIsValidPercentage(e, setNatalityRate)}
              />
              <input
                className="m-2 text-black"
                name="mortalityRate"
                placeholder="Mortality Rate (%)"
                value={mortalityRate}
                onChange={(e) => checkIfIsValidPercentage(e, setMortalityRate)}
              />
              <br />
              <Button type="submit">Run Simulation ▶️</Button>
              <Button type="button" onClick={handleReset}>
                Reset values 🗑️
              </Button>
            </form>
          </Boundary>
        </div>
      </div>

      {renderTable()}
    </div>
  );
}
