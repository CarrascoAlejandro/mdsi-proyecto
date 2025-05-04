'use client';

import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import { useState } from 'react';
import {
  simulateEggsAndChickens,
  EggsAndChickensDayRow,
  EggsAndChickensRunRow,
} from '#/lib/eggsAndChickens';
import {
  checkIfIsValidNumber,
  checkIfIsValidDecimal,
} from '#/utils/validators';
import { Loader } from '#/ui/loader';
import InputErrorList from '#/ui/input-error';
import { Boundary } from '#/ui/boundary';

export default function Page() {
  const [rows, setRows] = useState<EggsAndChickensRunRow[]>([]);

  const columns = [
    { name: 'key', label: 'Simulación' },
    { name: 'runTotalEggs', label: 'Huevos Totales' },
    { name: 'runBrokenEggs', label: 'Huevos Rotos' },
    { name: 'runDeadChickens', label: 'Pollos Muertos' },
    { name: 'runAliveChickens', label: 'Pollos Vivos' },
    { name: 'runTotalSoldEggs', label: 'Huevos Vendidos' },
    { name: 'runTotalMoney', label: 'Dinero Total' },
  ];

  const [simulationSummary, setSimulationSummary] = useState<{
    averageEggsProduced: number;
    averageEggsSold: number;
    averageChicksSold: number;
    averageIncome: number;
  } | null>(null);

  // params
  const [maxDays, setMaxDays] = useState('');
  const [maxSimulations, setMaxSimulations] = useState('');
  const [chickPrice, setChickPrice] = useState('');
  const [eggPrice, setEggPrice] = useState('');
  const [probBrokenEgg, setProbBrokenEgg] = useState('');
  const [probChick, setProbChick] = useState('');
  const [probGoodEgg, setProbGoodEgg] = useState('');
  const [probDeadChick, setProbDeadChick] = useState('');
  const [poissonLambda, setPoissonLambda] = useState('');

  // rand seeds
  const [seed1, setSeed1] = useState('');
  const [seed2, setSeed2] = useState('');
  const [seed3, setSeed3] = useState('');

  // meta management
  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [toggleTable, setToggleTable] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let errors = [];
    setLoading(true);

    // parse the form values
    const fSeed1 = parseInt(seed1, 10);
    const fSeed2 = parseInt(seed2, 10);
    const fSeed3 = parseInt(seed3, 10);
    const fMaxDays = parseInt(maxDays, 10);
    const fMaxSimulations = parseInt(maxSimulations, 10);
    const fChickPrice = parseFloat(chickPrice);
    const fEggPrice = parseFloat(eggPrice);
    const fProbBrokenEgg = parseFloat(probBrokenEgg);
    const fProbChick = parseFloat(probChick);
    const fProbGoodEgg = parseFloat(probGoodEgg);
    const fProbDeadChick = parseFloat(probDeadChick);
    const fPoissonLambda = parseFloat(poissonLambda);

    // validate fields to not be empty
    if (isNaN(fSeed1)) errors.push('Complete el campo de la semilla 1');
    if (isNaN(fSeed2)) errors.push('Complete el campo de la semilla 2');
    if (isNaN(fSeed3)) errors.push('Complete el campo de la semilla 3');
    if (isNaN(fMaxDays)) errors.push('Complete el campo de los días máximos');
    if (isNaN(fMaxSimulations))
      errors.push('Complete el campo de la cantidad de simulaciones');
    if (isNaN(fChickPrice))
      errors.push('Complete el campo del precio de los pollos');
    if (isNaN(fEggPrice))
      errors.push('Complete el campo del precio de los huevos');
    if (isNaN(fProbBrokenEgg))
      errors.push('Complete el campo de la probabilidad de huevos rotos');
    if (isNaN(fProbChick))
      errors.push('Complete el campo de la probabilidad de pollos');
    if (isNaN(fProbGoodEgg))
      errors.push('Complete el campo de la probabilidad de huevos buenos');
    if (isNaN(fProbDeadChick))
      errors.push('Complete el campo de la probabilidad de pollos muertos');
    if (isNaN(fPoissonLambda))
      errors.push(
        'Complete el campo de la probabilidad de la distribución de Poisson',
      );

    if (errors.length > 0) {
      setInputErrors([...errors]);
      setLoading(false);
      return;
    } else {
      setInputErrors([]);
    }

    const simulationResult: {
      globalResults: EggsAndChickensRunRow[];
      dayGroupedResults: { [key: number]: EggsAndChickensDayRow[] };
      averageEggsProduced: number;
      averageEggsSold: number;
      averageChicksSold: number;
      averageIncome: number;
    } = simulateEggsAndChickens(
      fMaxDays,
      fMaxSimulations,
      fChickPrice,
      fEggPrice,
      fProbBrokenEgg,
      fProbChick,
      fProbGoodEgg,
      fProbDeadChick,
      fPoissonLambda,
      fSeed1,
      fSeed2,
      fSeed3,
    );

    console.log(simulationResult);

    setRows(simulationResult.globalResults);
    setSimulationSummary({
      averageEggsProduced: simulationResult.averageEggsProduced,
      averageEggsSold: simulationResult.averageEggsSold,
      averageChicksSold: simulationResult.averageChicksSold,
      averageIncome: simulationResult.averageIncome,
    });

    setLoading(false);
  };

  const renderTable = () => {
    if (loading) return Loader();
    else if (inputErrors.length > 0) return InputErrorList(inputErrors);
    else if (rows?.length > 0)
      if (toggleTable) {
        // use a toggle to toggle the table
        return (
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">Resultados de la Simulación</h2>
            <Button
              type="button"
              onClick={() => setToggleTable(false)}
              className="mb-2"
            >
              Ocultar tabla
            </Button>
            <PrefabTable columns={columns} rows={rows} />
          </div>
        );
      } else {
        return (
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">Resultados de la Simulación</h2>
            <Button
              type="button"
              onClick={() => setToggleTable(true)}
              className="mb-2"
            >
              Mostrar tabla
            </Button>
          </div>
        );
      }
    else if (rows?.length === 0)
      return (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Resultados de la Simulación</h2>
          <p>No se encontraron resultados para mostrar.</p>
        </div>
      );
    else return <p>Sin datos para mostrar...</p>;
  };

  const renderSummary = () => {
    if (simulationSummary) {
      return (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Resumen de la Simulación</h2>
          <div className="prose-lg">
            <p>
              <div className="text-sm">
                Promedio de huevos producidos:{' '}
                {simulationSummary.averageEggsProduced.toFixed(2)}
              </div>
              <div className="text-sm">
                Promedio de huevos vendidos:{' '}
                {simulationSummary.averageEggsSold.toFixed(2)}
              </div>
              <div className="text-sm">
                Promedio de pollos vendidos:{' '}
                {simulationSummary.averageChicksSold.toFixed(2)}
              </div>
              <div className="text-sm">
                Promedio de ingresos:{' '}
                {simulationSummary.averageIncome.toFixed(2)} bs
              </div>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleReset = () => {
    setInputErrors([]);
    setRows([]);
    setLoading(false);
    setSeed1('');
    setSeed2('');
    setMaxSimulations('');
    setChickPrice('');
    setEggPrice('');
    setProbBrokenEgg('');
    setProbChick('');
    setProbGoodEgg('');
    setProbDeadChick('');
    setPoissonLambda('');
    setSeed3('');
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Simulación de una granja de huevos y pollos
      </h1>
      <ul>
        <li>
          La simulación consiste en una granja que produce en promedio N huevos
          cada día.
        </li>
        <li>
          Cada huevo tiene una probabilidad de romperse, de ser un pollo o de
          ser un huevo bueno para la venta.
        </li>
        <li>
          Cada pollo tiene una probabilidad de morir y de vivir. Solo se pueden
          vender los pollos vivos.
        </li>
        <li>
          El objetivo es determinar el ingreso promedio de la granja, haciendo
          varias corridas de la simulación. Donde cada simulación simula un
          plazo de tiempo en días.
        </li>
      </ul>
      <div className="flex gap-2">
        <div className="flex gap-2 md:col-span-2">
          <Form
            action="empty"
            onSubmit={handleSubmit}
            className="grid px-3 md:grid-cols-12"
          >
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Días máximos:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="maxDays"
                placeholder="Días máximos"
                value={maxDays}
                onChange={(e) => checkIfIsValidNumber(e, setMaxDays)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Simulaciones máximas:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="maxSimulations"
                placeholder="Simulaciones máximas"
                value={maxSimulations}
                onChange={(e) => checkIfIsValidNumber(e, setMaxSimulations)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Precio del pollo:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="chickPrice"
                placeholder="Precio del pollo"
                value={chickPrice}
                onChange={(e) => checkIfIsValidDecimal(e, setChickPrice)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Precio del huevo:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="eggPrice"
                placeholder="Precio del huevo"
                value={eggPrice}
                onChange={(e) => checkIfIsValidDecimal(e, setEggPrice)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Probabilidad de huevos rotos:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="probBrokenEgg"
                placeholder="Probabilidad de huevos rotos"
                value={probBrokenEgg}
                onChange={(e) => checkIfIsValidDecimal(e, setProbBrokenEgg)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Probabilidad de pollos:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="probChick"
                placeholder="Probabilidad de pollos"
                value={probChick}
                onChange={(e) => checkIfIsValidDecimal(e, setProbChick)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Probabilidad de huevos buenos:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="probGoodEgg"
                placeholder="Probabilidad de huevos buenos"
                value={probGoodEgg}
                onChange={(e) => checkIfIsValidDecimal(e, setProbGoodEgg)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Probabilidad de pollos muertos:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="probDeadChick"
                placeholder="Probabilidad de pollos muertos"
                value={probDeadChick}
                onChange={(e) => checkIfIsValidDecimal(e, setProbDeadChick)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Lambda de Poisson:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="poissonLambda"
                placeholder="Lambda de Poisson"
                value={poissonLambda}
                onChange={(e) => checkIfIsValidDecimal(e, setPoissonLambda)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla Aleatoria 1:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed1"
                placeholder="Semilla Aleatoria 1"
                value={seed1}
                onChange={(e) => checkIfIsValidNumber(e, setSeed1)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla Aleatoria 2:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed2"
                placeholder="Semilla Aleatoria 2"
                value={seed2}
                onChange={(e) => checkIfIsValidNumber(e, setSeed2)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla Aleatoria 3:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed3"
                placeholder="Semilla Aleatoria 3"
                value={seed3}
                onChange={(e) => checkIfIsValidNumber(e, setSeed3)}
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
      {renderTable()}
      {renderSummary()}
    </div>
  );
}
