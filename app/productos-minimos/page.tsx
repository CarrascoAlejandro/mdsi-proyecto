'use client';

import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import { useState } from 'react';
import {
  medianProductsRNG,
  medianProductsRow,
} from '#/lib/medianProductsGeneration';
import { findDegeneration } from '#/utils/rngUtils';
import { Boundary } from '#/ui/boundary';
import { Loader } from '#/ui/loader';
import InputErrorList from '#/ui/input-error';
import { checkIfIsValidNumber } from '#/utils/validators';

export default function Page() {
  const [rows, setRows] = useState<medianProductsRow[]>([]);
  /* const rows = [
    { key: '1', Yi: '96721', operation: '96721', X1: '672', Ri: '0.672' },
    { key: '2', Yi: '451584', operation: '0451584', X1: '515', Ri: '0.515' },
    { key: '3', Yi: '265225', operation: '0265225', X1: '652', Ri: '0.652' },
    { key: '4', Yi: '425104', operation: '0425104', X1: '251', Ri: '0.251' },
    { key: '5', Yi: '63001', operation: '063001', X1: '300', Ri: '0.300' },
  ]; */

  const columns = [
    { name: 'key', label: 'i' },
    { name: 'x_i', label: 'X_i' },
    { name: 'y_i', label: 'Y_i' },
    { name: 'operation', label: 'Operation' },
    { name: 'r_i', label: 'R_i' },
  ];

  const [seed1, setSeed1] = useState('');
  const [seed2, setSeed2] = useState('');
  const [quantity, setQuantity] = useState('');

  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [degeneration, setDegeneration] = useState(-1);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setInputErrors([]);
    event.preventDefault();
    setLoading(true);

    // Check equal length
    if (seed1.length !== seed2.length) {
      setInputErrors([
        ...inputErrors,
        'Las longitudes de las semillas no coinciden',
      ]);
    }

    const fSeed1 = parseInt(seed1, 10);
    const fSeed2 = parseInt(seed2, 10);
    const fQuantity = parseInt(quantity, 10);
    const D = seed1.length;

    if (inputErrors.length === 0) {
      const generatedRows = await medianProductsRNG(
        fSeed1,
        fSeed2,
        D,
        fQuantity,
      );
      setDegeneration(findDegeneration(generatedRows));
      setRows(generatedRows);
    }

    setLoading(false);
  };

  const renderDegeneration = () => {
    if (degeneration > -1)
      return (
        <div className="m-3">
          <Boundary labels={['Info']} color="orange">
            <div className="space-y-4 text-vercel-orange">
              <div className="prose-lg font-bold">Degeneración</div>
              <p className="text-sm">{`Se encontró degeneración de la secuencia en la posición i = ${degeneration}`}</p>
            </div>
          </Boundary>
        </div>
      );
  };

  const renderTable = () => {
    if (loading) return Loader();
    else if (inputErrors.length > 0) return InputErrorList(inputErrors);
    else if (rows?.length > 0)
      return <PrefabTable rows={rows} columns={columns} />;
    else return <p>Sin datos para mostrar...</p>;
  };

  const handleReset = () => {
    setInputErrors([]);
    setRows([]);
    setLoading(false);
    setSeed1('');
    setSeed2('');
    setQuantity('');
    setDegeneration(-1);
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Algoritmo de Productos Medios</h1>
      <ul>
        <li>El algoritmo requiere dos semillas de igual longitud D.</li>
        <li>
          Indica la cantidad de números pseudo-aleatorios que deseas generar.
        </li>
        <li>
          Ninguno de los valores de entrada puede ser negativo o con decimales.
        </li>
      </ul>
      <div className="flex gap-2">
        <div className="flex gap-2 md:col-span-2">
          <Form
            action="empty"
            onSubmit={handleSubmit}
            className="grid px-3 md:grid-cols-5"
          >
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla 1 (x_0):
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed-1"
                placeholder="Semilla 1 (x_0)"
                value={seed1}
                onChange={(e) => checkIfIsValidNumber(e, setSeed1)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla 2 (x_1):
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed-2"
                placeholder="Semilla 2 (x_1)"
                value={seed2}
                onChange={(e) => checkIfIsValidNumber(e, setSeed2)}
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
                value={quantity}
                onChange={(e) => checkIfIsValidNumber(e, setQuantity)}
              />
            </span>
            <span className="col-span-5">
              <Button type="submit">Generar 🎲</Button>
              <Button type="button" onClick={handleReset}>
                Limpiar valores 🗑️
              </Button>
            </span>
          </Form>
        </div>
      </div>
      {renderDegeneration()}
      {renderTable()}
    </div>
  );
}
