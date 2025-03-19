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

    // validate fields to not be empty
    let emptyFieldsErrors = [];
    if (isNaN(fSeed)) emptyFieldsErrors.push('Complete el campo de la semilla');
    if (isNaN(fQuantity))
      emptyFieldsErrors.push('Complete el campo de la cantidad a generar');
    if (isNaN(fK))
      emptyFieldsErrors.push('Complete el campo de la constante k');
    if (isNaN(fC))
      emptyFieldsErrors.push('Complete el campo de la constante c');

    if (emptyFieldsErrors.length > 0) {
      setInputErrors([...emptyFieldsErrors]);
    } else if (!isPrime(fC))
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
    if (!isPrime(parseInt(c, 10))) {
      warnings.push(`c = ${c} no es un número primo`);
    }

    if (warnings.length === 0) return;
    return (
      <>
        <h5>ADVERTENCIAS:</h5>
        <ul>
          {warnings.map((w, index) => (
            <li key={index}>{w}</li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Algoritmo de Congruencial Lineal</h1>
      <ul>
        <li>El algoritmo requiere una semilla que sea un entero positivo.</li>
        <li>
          El algoritmo requiere un parámetro k, y otro parámetro c que sean
          coprimos entre sí.
        </li>
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
        <div className="flex gap-2 md:col-span-2">
          <Form
            action="empty"
            onSubmit={handleSubmit}
            className="grid px-3 md:grid-cols-5"
          >
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla X_0:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black "
                name="X_0"
                placeholder="X_0 inicial"
                value={X_0}
                onChange={(e) => checkIfIsValidNumber(e, setX_0)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Constante k:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="k"
                placeholder="Constante k"
                value={k}
                onChange={(e) => checkIfIsValidNumber(e, setK)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Cantidad a generar:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="quantity"
                placeholder="Cantidad a generar"
                value={n}
                onChange={(e) => checkIfIsValidNumber(e, setN)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Constante c:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="c"
                placeholder="Constante c"
                value={c}
                onChange={(e) => checkIfIsValidNumber(e, setC)}
              />
            </span>
            <span className="col-span-5">
              <label htmlFor="nDecimals-input text-sm font-medium text-right">
                Cantidad de decimales:{' '}
              </label>
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
            </span>
            <br />
            <span className="col-span-5">
              <Button type="submit">Generar 🎲</Button>
            </span>
          </Form>
        </div>
        <div className="mt-5 md:col-span-1 md:mt-0">
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
              <div className="text-orange-500">{generationWarnings()}</div>
            </div>
          </Boundary>
        </div>
      </div>

      {renderTable()}
    </div>
  );
}
