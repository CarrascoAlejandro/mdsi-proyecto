'use client';

import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import { useState } from 'react';
import {
  simulateCustomerArrivals,
  CustomerArrivalRow,
  SimulationResult,
} from '#/lib/customerArrival';
import {
  checkIfIsValidNumber,
  checkIfIsValidDecimal,
  checkIfIsValidPercentage,
} from '#/utils/validators';
import { Loader } from '#/ui/loader';
import InputErrorList from '#/ui/input-error';
import { Boundary } from '#/ui/boundary';

export default function Page() {
  const [rows, setRows] = useState<CustomerArrivalRow[]>([]);

  const columns = [
    { name: 'key', label: 'i' },
    { name: 'day', label: 'Día' },
    { name: 'clients', label: 'Clientes' },
    { name: 'itemsSold', label: 'Artículos vendidos' },
    { name: 'income', label: 'Ingresos' },
    { name: 'totalCosts', label: 'Costos totales' },
    { name: 'netProfit', label: 'Ganancia neta' },
  ];

  const [simulationSummary, setSimulationSummary] = useState<{
    totalProfit: number;
    averageProfitPerDay: number;
    averageItemsSoldPerDay: number;
  } | null>(null);

  // params
  const [daysToSimulate, setDaysToSimulate] = useState('');
  const [hoursOpenPerDay, setHoursOpenPerDay] = useState('');
  const [fixedCosts, setFixedCosts] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [prob0, setProb0] = useState('');
  const [prob1, setProb1] = useState('');
  const [prob2, setProb2] = useState('');
  const [prob3, setProb3] = useState('');

  // rand seeds
  const [seed1, setSeed1] = useState('');
  const [seed2, setSeed2] = useState('');

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
    const fProb0 = parseFloat(prob0);
    const fProb1 = parseFloat(prob1);
    const fProb2 = parseFloat(prob2);
    const fProb3 = parseFloat(prob3);
    const fHoursOpenPerDay = parseInt(hoursOpenPerDay, 10);
    const fFixedCosts = parseFloat(fixedCosts);
    const fItemPrice = parseFloat(itemPrice);
    const fItemCost = parseFloat(itemCost);
    const fDaysToSimulate = parseInt(daysToSimulate, 10);

    // validate fields to not be empty
    if (isNaN(fSeed1)) errors.push('Complete el campo de la semilla 1');
    if (isNaN(fSeed2)) errors.push('Complete el campo de la semilla 2');
    if (isNaN(fProb0)) errors.push('Complete el campo de la probabilidad 0');
    if (isNaN(fProb1)) errors.push('Complete el campo de la probabilidad 1');
    if (isNaN(fProb2)) errors.push('Complete el campo de la probabilidad 2');
    if (isNaN(fProb3)) errors.push('Complete el campo de la probabilidad 3');
    if (isNaN(fHoursOpenPerDay))
      errors.push('Complete el campo de la cantidad de horas abiertas');
    if (isNaN(fFixedCosts))
      errors.push('Complete el campo de los costos fijos');
    if (isNaN(fItemPrice))
      errors.push('Complete el campo del precio del artículo');
    if (isNaN(fItemCost))
      errors.push('Complete el campo del costo del artículo');
    if (isNaN(fDaysToSimulate))
      errors.push('Complete el campo de la cantidad de días a simular');

    if (errors.length > 0) {
      setInputErrors([...errors]);
      setLoading(false);
      return;
    } else {
      setInputErrors([]);
    }

    const simulationResult: SimulationResult = await simulateCustomerArrivals(
      fDaysToSimulate,
      fHoursOpenPerDay,
      fFixedCosts,
      fItemCost,
      fItemPrice,
      0,
      4,
      fProb0 / 100,
      fProb1 / 100,
      fProb2 / 100,
      fProb3 / 100,
      fSeed1,
      fSeed2,
    );

    setRows(simulationResult.results);
    setSimulationSummary({
      totalProfit: simulationResult.totalProfit,
      averageProfitPerDay: simulationResult.averageProfitPerDay,
      averageItemsSoldPerDay: simulationResult.averageItemsSoldPerDay,
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
                <strong>Ganancia total:</strong> {simulationSummary.totalProfit}
              </div>
              <div className="text-sm">
                <strong>Ganancia promedio por día:</strong>{' '}
                {simulationSummary.averageProfitPerDay}
              </div>
              <div className="text-sm">
                <strong>Artículos vendidos promedio por día:</strong>{' '}
                {simulationSummary.averageItemsSoldPerDay}
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
    setDaysToSimulate('');
    setHoursOpenPerDay('');
    setFixedCosts('');
    setItemCost('');
    setItemPrice('');
    setProb0('');
    setProb1('');
    setProb2('');
    setProb3('');
    setSimulationSummary(null);
    setToggleTable(false);
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Llegada de clientes a una tienda</h1>
      <ul>
        <li>
          Simula la llegada de clientes a una tienda y la venta de artículos.
        </li>
        <li>
          Existe una distribución de probabilidad uniforme para la cantidad de
          clientes que llegan a la tienda.
        </li>
        <li>
          La cantidad de artículos vendidos por cliente sigue una distribución
          de probabilidad heurística, configurable por parametros.
        </li>
        <li>
          El usuario puede elegir la cantidad de días a simular y la cantidad de
          horas abiertas por día.
        </li>
        <li>
          El usuario puede elegir los costos fijos y el precio de los artículos
          vendidos.
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
              Días a simular:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="daysToSimulate"
                placeholder="Cantidad de días"
                value={daysToSimulate}
                onChange={(e) => checkIfIsValidNumber(e, setDaysToSimulate)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Horas abiertas por día:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="hoursOpenPerDay"
                placeholder="Horas abiertas"
                value={hoursOpenPerDay}
                onChange={(e) => checkIfIsValidNumber(e, setHoursOpenPerDay)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Costos fijos:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="fixedCosts"
                placeholder="Costos fijos"
                value={fixedCosts}
                onChange={(e) => checkIfIsValidDecimal(e, setFixedCosts)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Costo del artículo:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="itemCost"
                placeholder="Costo del artículo"
                value={itemCost}
                onChange={(e) => checkIfIsValidDecimal(e, setItemCost)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Precio del artículo:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="itemPrice"
                placeholder="Precio del artículo"
                value={itemPrice}
                onChange={(e) => checkIfIsValidDecimal(e, setItemPrice)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Probabilidad 0 artículos:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="prob0"
                placeholder="Probabilidad 0"
                value={prob0}
                onChange={(e) => checkIfIsValidPercentage(e, setProb0)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Probabilidad 1 artículo:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="prob1"
                placeholder="Probabilidad 1"
                value={prob1}
                onChange={(e) => checkIfIsValidPercentage(e, setProb1)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Probabilidad 2 artículos:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="prob2"
                placeholder="Probabilidad 2"
                value={prob2}
                onChange={(e) => checkIfIsValidPercentage(e, setProb2)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Probabilidad 3 artículos:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="prob3"
                placeholder="Probabilidad 3"
                value={prob3}
                onChange={(e) => checkIfIsValidPercentage(e, setProb3)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla 1:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed1"
                placeholder="Semilla 1"
                value={seed1}
                onChange={(e) => checkIfIsValidNumber(e, setSeed1)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla 2:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed2"
                placeholder="Semilla 2"
                value={seed2}
                onChange={(e) => checkIfIsValidNumber(e, setSeed2)}
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
