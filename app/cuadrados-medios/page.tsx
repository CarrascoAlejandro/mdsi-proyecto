import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import { useState } from 'react';
import { medianSquaresRNG, medianSquaresRow } from '#/lib/medianSquaresGeneration';

export default function Page() {
  const [rows, setRows] = useState<medianSquaresRow[]>([]);

  const columns = [
    { name: 'key', label: 'i' },
    { name: 'x_i', label: 'X_i' },
    { name: 'y_i', label: 'Y_i' },
    { name: 'operation', label: 'Operation' },
    { name: 'r_i', label: 'R_i' },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const seed = parseInt(formData.get('seed') as string, 10);
    const quantity = parseInt(formData.get('quantity') as string, 10);
    const D = seed.toString.length;

    const generatedRows = medianSquaresRNG(seed, D, quantity);
    setRows(generatedRows);
  }

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
        <Form action="empty">
          <input className="m-2 text-black" name="seed" placeholder="Seed" />
          <input
            className="m-2 text-black"
            name="quantity"
            placeholder="Quantity"
          />
          <Button type="submit">Generate 🎲</Button>
        </Form>
      </div>
      <PrefabTable rows={rows} columns={columns} />
    </div>
  );
}
