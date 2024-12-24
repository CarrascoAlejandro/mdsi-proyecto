import Form from 'next/form';
import Button from '#/ui/button';
import PrefabTable from '#/ui/tabletable';

export default function Page() {
  const rows = [
    { key: '1', Yi: '96721', operation: '96721', X1: '672', Ri: '0.672' },
    { key: '2', Yi: '451584', operation: '0451584', X1: '515', Ri: '0.515' },
    { key: '3', Yi: '265225', operation: '0265225', X1: '652', Ri: '0.652' },
    { key: '4', Yi: '425104', operation: '0425104', X1: '251', Ri: '0.251' },
    { key: '5', Yi: '63001', operation: '063001', X1: '300', Ri: '0.300' },
  ];

  const columns = [
    { name: 'key' },
    { name: 'Yi' },
    { name: 'operation' },
    { name: 'X1' },
    { name: 'Ri' },
  ];

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Algoritmo de Productos Mínimos</h1>
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
          <input
            className="m-2 text-black"
            name="seed-1"
            placeholder="1st Seed"
          />
          <input
            className="m-2 text-black"
            name="seed-2"
            placeholder="2nd Seed"
          />
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
