'use server';
import { NextRequest, NextResponse } from 'next/server';

// /pages/api/simulate.js
export async function POST(req: NextRequest) {
  const { startYear, lastYear, initPopulation, natalityRate, mortalityRate } =
    await req.json();

  //console.log({ startYear, lastYear, initPopulation, natalityRate, mortalityRate });

  const columns = [
    { name: 'year', label: 'Año' },
    { name: 'births', label: 'Nacimientos' },
    { name: 'deaths', label: 'Muertes' },
    { name: 'population', label: 'Población' },
  ];

  // Convert input values to numbers
  const start = parseInt(startYear, 10);
  const end = parseInt(lastYear, 10);
  let currentPopulation = parseFloat(initPopulation);
  const natality = parseFloat(natalityRate) / 100; // Convert percentage to decimal
  const mortality = parseFloat(mortalityRate) / 100; // Convert percentage to decimal

  // Validate inputs
  if (
    isNaN(start) ||
    isNaN(end) ||
    isNaN(currentPopulation) ||
    isNaN(natality) ||
    isNaN(mortality) ||
    start > end
  ) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  // Generate results
  const results = [];
  for (let year = start; year <= end; year++) {
    const births = currentPopulation * natality;
    const deaths = currentPopulation * mortality;
    const newPopulation = currentPopulation + births - deaths;

    results.push({
      key: year.toString(),
      year: year.toString(),
      births: births.toFixed(0), // Format as whole numbers
      deaths: deaths.toFixed(0),
      population: newPopulation.toFixed(0),
    });

    currentPopulation = newPopulation; // Update for the next year's calculation
  }

  return NextResponse.json(
    {
      rows: results,
      columns: columns,
    },
    { status: 200 },
  );
}
