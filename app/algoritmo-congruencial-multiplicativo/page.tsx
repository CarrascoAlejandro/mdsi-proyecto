'use client';

import React, { useState } from 'react';

import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import { checkIfIsValidNumber } from '#/utils/validators';
import { Boundary } from '#/ui/boundary';
import {
  productCongruentialRNG,
  productCongruentialRow,
} from '#/lib/productCongruentialGeneration';
import { Loader } from '#/ui/loader';
import InputErrorList from '#/ui/input-error';
import { nextPowerOfTwo } from '#/utils/numberUtils';
import { isPowerOfTwo, isPrime } from '#/utils/posValidators';

export default function Page() {
  const [rows, setRows] = useState<productCongruentialRow[]>([]);

  const [X_0, setX_0] = React.useState('');
  const [k, setK] = React.useState('');
  const [n, setN] = React.useState('');
  const [formula, setFormula] = React.useState(0);
  const [g, setG] = React.useState('');
  const [m, setM] = React.useState('');
  const [a, setA] = React.useState('');
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

    if (fSeed % 2 === 0)
      setInputErrors(['El valor de x_0 debe ser IMPAR', ...inputErrors]);

    if (inputErrors.length > 0) {
      setLoading(false);
      return;
    }

    const generation = await productCongruentialRNG(
      fSeed,
      fQuantity,
      fK,
      formula === 0 ? (x: number) => 3 + 8 * x : (x: number) => 5 + 8 * x,
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
    else return <p>Sin datos para mostrar...</p>;
  };

  const generationWarnings = () => {
    let warnings = [] as string[];
    if (!isPowerOfTwo(parseInt(n)) && !Number.isNaN(parseInt(n))) {
      const nn = nextPowerOfTwo(parseInt(n));
      warnings.push(
        `Se generarán ${nn} valores para alcanzar una potencia de 2`,
      );
    }
    if (parseInt(X_0) % 2 === 0 && !Number.isNaN(parseInt(n))) {
      warnings.push(`X_0 = ${X_0} debería ser impar`);
    }

    return (
      <ul>
        {warnings.map((w, index) => (
          <li key={index}>{w}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Algoritmo de Congruencial Multiplicativo
      </h1>
      <ul>
        <li>
          El algoritmo requiere una semilla que sea un entero positivo impar.
        </li>
        <li>El algoritmo requiere un parámetro k.</li>
        <li>
          El algoritmo solo puede generar números en cantidades que sean
          potencias de dos. Este programa ajustará automáticamente para generar
          la potencia de 2 inmediata superior al valor deseado.
        </li>
        <li>
          El programa garantiza una secuencia no degenerativa y cíclica siempre
          que se cumplan las reglas indicadas anteriormente.
        </li>
      </ul>
      <div className="grid md:grid-cols-3">
        <div className="col-span-2 flex gap-2">
          <Form action="empty" onSubmit={handleSubmit}>
            <input
              className="m-2 text-black"
              name="X_0"
              placeholder="X_0 inicial"
              value={X_0}
              onChange={(e) => checkIfIsValidNumber(e, setX_0)}
            />
            <input
              className="m-2 text-black"
              name="k"
              placeholder="Constante k"
              value={k}
              onChange={(e) => checkIfIsValidNumber(e, setK)}
            />
            <input
              className="m-2 text-black"
              name="quantity"
              placeholder="Candidad a generar"
              value={n}
              onChange={(e) => checkIfIsValidNumber(e, setN)}
            />
            <br />
            <label htmlFor="nDecimals-input">Cantidad de Decimales: </label>
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
            <Button type="submit">Generar 🎲</Button>
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
                  <b>Formula elegida: </b>
                  {formula === 0 ? '3 + 8k' : '5 + 8k'}
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
