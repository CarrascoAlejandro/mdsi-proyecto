'use client';

import React, { useEffect, useState } from 'react';

import {
  linearCongruentialRow,
  linearCongruentialRNG,
} from '#/lib/linealCongruentialGenerator';

import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import { checkIfIsValidNumber } from '#/utils/validators';
import { Boundary } from '#/ui/boundary';
import { Loader } from '#/ui/loader';
import InputErrorList from '#/ui/input-error';
import { isPowerOfTwo, isPrime } from '#/utils/posValidators';
import { nextPowerOfTwo } from '#/utils/numberUtils';

export default function Page() {
  const [rows, setRows] = useState<linearCongruentialRow[]>([]);

  const [X_0, setX_0] = React.useState('');
  const [k, setK] = React.useState('');
  const [c, setC] = React.useState('');
  const [g, setG] = React.useState('');
  const [m, setM] = React.useState('');
  const [a, setA] = React.useState('');
  const [n, setN] = React.useState('');
  const [nDecimals, setNDecimals] = React.useState(5);

  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { name: 'key', label: 'i' },
    { name: 'x_i', label: 'Xi' },
    { name: 'r_i', label: 'Ri' },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setInputErrors([]);
    event.preventDefault();
    setLoading(true);

    const fSeed = parseInt(X_0, 10);
    const fQuantity = parseInt(n, 10);
    const fK = parseInt(k, 10);
    const fC = parseInt(c, 10);

    if (!isPrime(fC))
      setInputErrors([
        'El valor de c debe ser un número primo',
        ...inputErrors,
      ]);

    if (inputErrors.length > 0) {
      setLoading(false);
      return;
    }

    const generation = await linearCongruentialRNG(
      fSeed,
      fQuantity,
      fK,
      fC,
      nDecimals,
    );

    setG(generation.g.toString());
    setM(generation.m.toString());
    setA(generation.a.toString());
    setRows(generation.values);

    setLoading(false);
  };

  const renderTable = () => {
    if (loading) return Loader();
    else if (inputErrors.length > 0) return InputErrorList(inputErrors);
    else if (rows?.length > 0)
      return <PrefabTable rows={rows} columns={columns} />;
    else return <p>No data to show...</p>;
  };

  /* useEffect(() => {
    if(!isPrime(parseInt(c, 10))) setInputErrors(['El valor de c debe ser un número primo', ...inputErrors]);
    else setInputErrors([...inputErrors]);
  }, [c]) */

  const generationWarnings = () => {
    let warnings = [] as string[];
    if (!isPowerOfTwo(parseInt(n)) && !Number.isNaN(parseInt(n))) {
      const nn = nextPowerOfTwo(parseInt(n));
      warnings.push(
        `Se generarán ${nn} valores para alcanzar una potencia de 2`,
      );
    }
    if (!isPrime(parseInt(c, 10))) {
      warnings.push(`c = ${c} no es un número primo`);
    }

    return (
      <ul>
        {warnings.map((w, index) => (
          <li key={index}>{w}</li> // Se debe retornar el <li>
        ))}
      </ul>
    );
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Algoritmo de Congruencial Lineal</h1>
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
          <Form action="empty" onSubmit={handleSubmit}>
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
              value={n}
              onChange={(e) => checkIfIsValidNumber(e, setN)}
            />
            <input
              className="m-2 text-black"
              name="c"
              placeholder="Constant c"
              value={c}
              onChange={(e) => checkIfIsValidNumber(e, setC)}
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
                  {n}
                </li>
                <li>
                  <b>k = </b>
                  {k}
                </li>
                <li>
                  <b>c = </b>
                  {c}
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
              {generationWarnings()}
            </div>
          </Boundary>
        </div>
      </div>

      {renderTable()}
    </div>
  );
}
