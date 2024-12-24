'use client';

import React from 'react';

import Form from 'next/form';
import Button from '#/ui/button';
import PrefabTable from '#/ui/tabletable';
import { checkIfIsValidNumber } from '#/utils/validators';
import { Boundary } from '#/ui/boundary';

export default function Page() {
  const [X_0, setX_0] = React.useState('');
  const [k, setK] = React.useState('');
  const [q, setQ] = React.useState('');
  const [formula, setFormula] = React.useState(0);
  const [g, setG] = React.useState('');
  const [m, setM] = React.useState('');
  const [a, setA] = React.useState('');
  const [nDecimals, setNDecimals] = React.useState(0);

  const rows = [
    { key: '1', Xi: '2', Ri: '0.677' },
    { key: '2', Xi: '1', Ri: '0.333' },
    { key: '3', Xi: '0', Ri: '0.000' },
    { key: '4', Xi: '3', Ri: '1.000' },
    { key: '5', Xi: '2', Ri: '0.677' },
  ];

  const columns = [{ name: 'key' }, { name: 'Xi' }, { name: 'Ri' }];

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
          <Form action="empty">
            <input
              className="m-2 text-black"
              name="X_0"
              placeholder="Initial X_0"
              value={X_0}
              onChange={(e) => checkIfIsValidNumber(e, setX_0)}
            />
            <input
              className="m-2 text-black"
              name="k"
              placeholder="Constant k"
              value={k}
              onChange={(e) => checkIfIsValidNumber(e, setK)}
            />
            <input
              className="m-2 text-black"
              name="quantity"
              placeholder="Quantity to generate"
              value={q}
              onChange={(e) => checkIfIsValidNumber(e, setQ)}
            />
            <br />
            <label htmlFor="nDecimals-input">Number of Decimals: </label>
            <b>0</b>
            <input
              id="nDecimals-input"
              className="m-2 text-black"
              name="decimal"
              type="range"
              min={0}
              max={9}
              value={nDecimals}
              onChange={(e) => setNDecimals(Number(e.target.value))}
            />
            <b>9</b>
            <span> {nDecimals /* TODO: Put a prettier format */}</span>
            <br />
            <div className="m-2">
              <Boundary labels={['Formula de a']} size="small">
                <input
                  type="radio"
                  id="chosen_formula_1st"
                  name="formula"
                  value="0"
                  checked={formula == 0}
                  onChange={(e) => setFormula(0)}
                />
                <label
                  htmlFor="chosen_formula_1st"
                  className="prose prose-sm prose-invert m-3 max-w-none"
                >
                  a = 3 + 8k
                </label>
                <br />
                <input
                  type="radio"
                  id="chosen_formula_2nd"
                  name="formula"
                  value="1"
                  checked={formula == 1}
                  onChange={(e) => setFormula(1)}
                />
                <label
                  htmlFor="chosen_formula_2nd"
                  className="prose prose-sm prose-invert m-3 max-w-none"
                >
                  a = 5 + 8k
                </label>
                <br />
              </Boundary>
            </div>
            <br />
            <Button type="submit">Generate 🎲</Button>
          </Form>
        </div>
        <div className="col-span-1">
          <Boundary labels={['Resumen de Valores']} size="small">
            <div className="prose prose-sm prose-invert max-w-none">
              <ul>
                <li>
                  <b>X_0 = </b>
                  {X_0}
                </li>
                <li>
                  <b>P = </b>
                  {q}
                </li>
                <li>
                  <b>k = </b>
                  {k}
                </li>
                <li>
                  <b>chosen formula: </b>
                  {formula}
                </li>
                <li>
                  <b>g = </b>
                  {g}
                </li>
                <li>
                  <b>m = </b>
                  {m}
                </li>
                <li>
                  <b>a = </b>
                  {a}
                </li>
              </ul>
            </div>
          </Boundary>
        </div>
      </div>

      <PrefabTable rows={rows} columns={columns} />
    </div>
  );
}
