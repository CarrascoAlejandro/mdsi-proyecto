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
    setInputErrors([]);
    event.preventDefault();
    setLoading(true);

    const fSeed = parseInt(seed, 10);
    const fQuantity = parseInt(quantity, 10);
    const D = seed.length;

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
              <div className="prose prose-lg font-bold">Degeneración</div>
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
    else return <p>No data to show...</p>;
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
      <div className="flex gap-2">
        <Form action="empty" onSubmit={handleSubmit}>
          <input
            className="m-2 text-black"
            name="seed"
            placeholder="Seed"
            value={seed}
            onChange={(e) => checkIfIsValidNumber(e, setSeed)}
          />
          <input
            className="m-2 text-black"
            name="quantity"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => checkIfIsValidNumber(e, setQuantity)}
          />
          <Button type="submit">Generate 🎲</Button>
          <Button type="button" onClick={handleReset}>
            Reset values 🗑️
          </Button>
        </Form>
      </div>
      {renderDegeneration()}
      {renderTable()}
    </div>
  );
}
