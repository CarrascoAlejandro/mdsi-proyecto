import { Table, TableHeader, TableBody, TableRow, TableCell } from '#/ui/table';

interface PrefabColumn {
  name: string;
  label: string;
}

export interface PrefabRow {
  key: string;
  [key: string]: string | number; // Allows dynamic additional columns
}

export interface PrefabTableProps {
  rows: PrefabRow[];
  columns: PrefabColumn[];
}

export function PrefabTable({ rows, columns }: PrefabTableProps) {
  const displayValue = (value: string | number) => {
    if (typeof value === 'number') {
      if (typeof value === 'number' && value % 1 !== 0) {
        // If the number is not an integer, format it with two decimal places
        return value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        // If the number is an integer, format it with no decimal places
        return value.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
      }
    }
    if (typeof value === 'string') {
      return value;
    }
    return '';
  };

  return (
    <Table className="min-w-full border-collapse rounded-lg bg-black shadow-md">
      <TableHeader>
        <TableRow className="bg-indigo-200 text-gray-700">
          {columns.map((col) => (
            <TableCell key={col.name} className="font-semibold">
              {col.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.key}
            className="cursor-pointer transition duration-200 hover:bg-indigo-900"
          >
            {columns.map((col) => (
              <TableCell key={col.name}>
                {displayValue(row[col.name])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
