import { Table, TableHeader, TableBody, TableRow, TableCell } from '#/ui/table';

interface PrefabColumn {
  name: string;
}

interface PrefabRow {
  key: string;
  [key: string]: string; // Allows dynamic additional columns
}

interface PrefabTableProps {
  rows: PrefabRow[];
  columns: PrefabColumn[];
}

export default function PrefabTable({ rows, columns }: PrefabTableProps) {
  return (
    <Table className="min-w-full border-collapse rounded-lg bg-white shadow-md">
      <TableHeader>
        <TableRow className="bg-indigo-100 text-gray-700">
          {columns.map((col) => (
            <TableCell key={col.name} className="font-semibold">
              {col.name}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.key}
            className="cursor-pointer transition duration-200 hover:bg-indigo-50"
          >
            {columns.map((col) => (
              <TableCell key={col.name}>
                {row[col.name] || ''} {/* Dynamically access values */}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
