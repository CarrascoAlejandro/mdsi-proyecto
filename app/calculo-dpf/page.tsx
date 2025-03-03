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

export default function Page() {
  const [years, setYears] = React.useState('');
  const [interest, setinterest] = React.useState('');
  const [initCapital, setInitCapital] = React.useState('');

  const rows = [
    { key: '1', year: '2024', interest: '50.00', capital: '1050.00' },
    { key: '2', year: '2025', interest: '52.50', capital: '1102.50' },
    { key: '3', year: '2026', interest: '55.13', capital: '1157.63' },
    { key: '4', year: '2027', interest: '57.88', capital: '1215.51' },
    { key: '5', year: '2028', interest: '60.78', capital: '1276.28' },
  ];

  const columns = [
    { name: 'year', label: 'Year' },
    { name: 'interest', label: 'Interest' },
    { name: 'capital', label: 'Capital' },
  ];

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Algoritmo de Congruencial Multiplicativo
      </h1>
      <ul>
        <li>Welcome to cuadrados medios</li>
        <li>Caches responses are fresh for 60 seconds.</li>
        <li>
          Try navigating to each post and noting the timestamp of when the page
          was rendered. Refresh the page after 60 seconds to trigger a
          revalidation for the next request. Refresh again to see the
          revalidated page.
        </li>
        <li>Note that the fetch cache can be persisted across builds.</li>
      </ul>
      <div className="grid md:grid-cols-3">
        <div className="col-span-2 flex gap-2">
          <Boundary labels={['Simulation Parameters']} size="small">
            <Form action="empty">
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

      <PrefabTable rows={rows} columns={columns} />
    </div>
  );
}
