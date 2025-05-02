'use client';

import React from 'react';

import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import {
  checkIfIsValidNumber,
  checkIfIsValidPercentage,
} from '#/utils/validators';
import { Boundary } from '#/ui/boundary';
import { dpfRow, calculateDPF } from '#/lib/calculateDPF';

export default function Page() {
  const [rows, setRows] = React.useState<dpfRow[]>([]);

  const columns = [
    { name: 'year', label: 'Año' },
    { name: 'interest', label: 'Interés' },
    { name: 'capital', label: 'Capital' },
  ];

  // params
  const [years, setYears] = React.useState('');
  const [interest, setinterest] = React.useState('');
  const [initCapital, setInitCapital] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // parse the form values
    const fYears = parseInt(years, 10);
    const fInterest = parseFloat(interest);
    const fInitCapital = parseFloat(initCapital);

    // validate fields to not be empty
    if (years === '' || interest === '' || initCapital === '') {
      alert('Please fill all fields');
      return;
    }

    // validate fields to be numbers
    if (isNaN(fYears) || isNaN(fInterest) || isNaN(fInitCapital)) {
      alert('Please fill all fields with valid numbers');
      return;
    }

    // run the simulation
    const result = calculateDPF(fYears, fInterest, fInitCapital);
    setRows(result);
  };

  const renderTable = () => {
    if (rows.length === 0) {
      return <p>Sin datos para mostrar</p>;
    }

    return (
      <div className="overflow-x-auto">
        <PrefabTable rows={rows} columns={columns} />
      </div>
    );
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Calculadora de Depósito a Plazo Fijo (DPF)
      </h1>
      <ul>
        <li>
          A partir de un capital inicial determina las ganancias de un DPF
        </li>
        <li>
          El interés es compuesto y se calcula anualmente. El interés se calcula
          sobre el capital inicial.
        </li>
        <li>
          El interés se calcula al final de cada año y se suma al capital
          inicial.
        </li>
      </ul>
      <div className="grid md:grid-cols-3">
        <div className="col-span-2 flex gap-2">
          <Boundary labels={['Simulation Parameters']} size="small">
            <Form action="empty" onSubmit={handleSubmit}>
              <input
                className="m-2 text-black"
                name="years"
                placeholder="Time in Years"
                value={years}
                onChange={(e) => checkIfIsValidNumber(e, setYears)}
              />
              <input
                className="m-2 text-black"
                name="interest"
                placeholder="Interest (%)"
                value={interest}
                onChange={(e) => checkIfIsValidPercentage(e, setinterest)}
              />
              <input
                className="m-2 text-black"
                name="initCapital"
                placeholder="Initial Capital ($)"
                value={initCapital}
                onChange={(e) => checkIfIsValidNumber(e, setInitCapital)}
              />
              <br />

              <Button type="submit">Run Simulation ▶️</Button>
              <Button type="reset">Reset values 🗑️</Button>
            </Form>
          </Boundary>
        </div>
      </div>
      {renderTable()}
    </div>
  );
}
