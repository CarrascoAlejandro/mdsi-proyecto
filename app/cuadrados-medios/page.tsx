'use client';

import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import { useState } from 'react';
import {
  medianSquaresRNG,
  medianSquaresRow,
} from '#/lib/medianSquaresGeneration';
import { checkIfIsValidNumber } from '#/utils/validators';
import { Loader } from '#/ui/loader';
import InputErrorList from '#/ui/input-error';
import { findDegeneration } from '#/utils/rngUtils';
import { Boundary } from '#/ui/boundary';

export default function Page() {
  const [rows, setRows] = useState<medianSquaresRow[]>([]);

  const columns = [
    { name: 'key', label: 'i' },
    { name: 'x_i', label: 'X_i' },
    { name: 'y_i', label: 'Y_i' },
    { name: 'operation', label: 'Operation' },
    { name: 'r_i', label: 'R_i' },
  ];

  const [seed, setSeed] = useState('');
  const [quantity, setQuantity] = useState('');

  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [degeneration, setDegeneration] = useState(-1);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let errors = [];
    setLoading(true);

    const fSeed = parseInt(seed, 10);
    const fQuantity = parseInt(quantity, 10);
    const D = seed.length;
    console.log('errors1', inputErrors);
    console.log('fSeed', fSeed);
    console.log('fQuantity', fQuantity);
    // validate fields to not be empty
    if (isNaN(fSeed)) errors.push('Complete el campo de la semilla');
    if (isNaN(fQuantity))
      errors.push('Complete el campo de la cantidad a generar');

    if (fSeed <= 0) errors.push('El valor de la semilla debe ser mayor a 0');

    if (errors.length > 0) {
      setInputErrors([...errors]);
      setLoading(false);
      setDegeneration(-1);
      return;
    } else {
      setInputErrors([]);
    }

    const generatedRows = await medianSquaresRNG(fSeed, D, fQuantity);
    setDegeneration(findDegeneration(generatedRows));
    setRows(generatedRows);

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
    setSeed('');
    setQuantity('');
    setDegeneration(-1);
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Algoritmo de Cuadrados Medios</h1>
      <ul>
        <li>El algoritmo requiere una semilla de longitud D.</li>
        <li>Los números generados tendrán D posiciones decimales.</li>
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
              Semilla x_0:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed"
                placeholder="Semilla x_0"
                value={seed}
                onChange={(e) => checkIfIsValidNumber(e, setSeed)}
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
