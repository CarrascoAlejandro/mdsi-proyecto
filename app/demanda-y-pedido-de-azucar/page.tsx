'use client';

import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import { useState } from 'react';
import {
  simulateSugarStore,
  SugarStoreRow,
  SugarStoreSimulationSummary,
} from '#/lib/sugarStore';
import {
  checkIfIsValidNumber,
  checkIfIsValidDecimal,
} from '#/utils/validators';
import { Loader } from '#/ui/loader';
import InputErrorList from '#/ui/input-error';
import { Boundary } from '#/ui/boundary';

export default function Page() {
  const [rows, setRows] = useState<SugarStoreRow[]>([]);

  const columns = [
    { name: 'key', label: 'Día' },
    { name: 'sugarStock', label: 'Stock de Azúcar' },
    { name: 'todayDemand', label: 'Demanda Diaria' },
    { name: 'dailySales', label: 'Ventas Diarias' },
    { name: 'lostSales', label: 'Ventas Perdidas' },
    { name: 'holdingCostToday', label: 'Costo de Almacenamiento' },
    { name: 'orderCostToday', label: 'Costo de Pedido' },
    { name: 'orderedAmount', label: 'Cantidad Pedida' },
    { name: 'timeToDelivery', label: 'Tiempo de Entrega' },
    { name: 'todayIncome', label: 'Ingreso Diario' },
    { name: 'todayCost', label: 'Costo Diario' },
    { name: 'todayProfit', label: 'Ganancia Diaria' },
  ];

  const [simulationSummary, setSimulationSummary] =
    useState<SugarStoreSimulationSummary | null>(null);

  // params
  const [maxDays, setMaxDays] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [orderPlacementCost, setOrderPlacementCost] = useState('');
  const [orderUnitCost, setOrderUnitCost] = useState('');
  const [unitSalePrice, setUnitSalePrice] = useState('');
  const [holdingCost, setHoldingCost] = useState('');
  const [minTimeToDelivery, setMinTimeToDelivery] = useState('');
  const [maxTimeToDelivery, setMaxTimeToDelivery] = useState('');
  const [averageDemand, setAverageDemand] = useState('');

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
    const fMaxDays = parseInt(maxDays, 10);
    const fMaxStock = parseInt(maxStock, 10);
    const fOrderPlacementCost = parseFloat(orderPlacementCost);
    const fOrderUnitCost = parseFloat(orderUnitCost);
    const fUnitSalePrice = parseFloat(unitSalePrice);
    const fHoldingCost = parseFloat(holdingCost);
    const fMinTimeToDelivery = parseInt(minTimeToDelivery, 10);
    const fMaxTimeToDelivery = parseInt(maxTimeToDelivery, 10);
    const fAverageDemand = parseFloat(averageDemand);

    // validate fields to not be empty
    if (isNaN(fSeed1)) errors.push('Complete el campo de la semilla 1');
    if (isNaN(fSeed2)) errors.push('Complete el campo de la semilla 2');
    if (isNaN(fMaxDays))
      errors.push('Complete el campo de la cantidad máxima de días');
    if (isNaN(fMaxStock)) errors.push('Complete el campo del stock máximo');
    if (isNaN(fOrderPlacementCost))
      errors.push('Complete el campo del costo de colocación de pedido');
    if (isNaN(fOrderUnitCost))
      errors.push('Complete el campo del costo unitario de pedido');
    if (isNaN(fUnitSalePrice))
      errors.push('Complete el campo del precio de venta por unidad');
    if (isNaN(fHoldingCost))
      errors.push('Complete el campo del costo de almacenamiento');
    if (isNaN(fMinTimeToDelivery))
      errors.push('Complete el campo del tiempo mínimo de entrega');
    if (isNaN(fMaxTimeToDelivery))
      errors.push('Complete el campo del tiempo máximo de entrega');
    if (isNaN(fAverageDemand))
      errors.push('Complete el campo de la demanda promedio');

    if (errors.length > 0) {
      setInputErrors([...errors]);
      setLoading(false);
      return;
    } else {
      setInputErrors([]);
    }

    const simulationResult: {
      simulationResults: SugarStoreRow[];
      simulationSummary: SugarStoreSimulationSummary;
    } = simulateSugarStore(
      fMaxDays,
      fMaxStock,
      fOrderPlacementCost,
      fOrderUnitCost,
      fUnitSalePrice,
      fHoldingCost,
      fMinTimeToDelivery,
      fMaxTimeToDelivery,
      fAverageDemand,
      fSeed1,
      fSeed2,
    );

    setRows(simulationResult.simulationResults);
    setSimulationSummary(simulationResult.simulationSummary);

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
                Total de Ganancias: {simulationSummary.totalProfit.toFixed(2)}{' '}
                Bs.
              </div>
              <div className="text-sm">
                Total de Kg Vendidos: {simulationSummary.totalKgSold} Kg
              </div>
              <div className="text-sm">
                Total de Demanda Insatisfecha:{' '}
                {simulationSummary.totalSalesLost} Kg
              </div>
              <div className="text-sm">
                Ingreso Promedio Diario:{' '}
                {simulationSummary.averageIncomeDaily.toFixed(2)} Bs.
              </div>
              <div className="text-sm">
                Costo Promedio Diario:{' '}
                {simulationSummary.averageCostDaily.toFixed(2)} Bs.
              </div>
              <div className="text-sm">
                Kg Vendidos Promedio Diario:{' '}
                {simulationSummary.averageKgSoldDaily.toFixed(2)} Kg
              </div>
              <div className="text-sm">
                Demanda Promedio Diaria:{' '}
                {simulationSummary.averageDailyDemand.toFixed(2)} Kg
              </div>
              <div className="text-sm">
                Tiempo Promedio de Entrega:{' '}
                {simulationSummary.averageTimeToDelivery.toFixed(2)} días
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
    setMaxDays('');
    setMaxStock('');
    setOrderPlacementCost('');
    setOrderUnitCost('');
    setUnitSalePrice('');
    setHoldingCost('');
    setMinTimeToDelivery('');
    setMaxTimeToDelivery('');
    setAverageDemand('');
    setSeed1('');
    setSeed2('');
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Simulación de Demanda y Pedido de azúcar en una tienda
      </h1>
      <ul>
        <li>La simulación consiste modelar un sistema de almacén.</li>
        <li>
          Cada día se genera una demanda diaria de azúcar, que es una variable
          aleatoria que sigue una distribución de probabilidad exponencial.
        </li>
        <li>
          La tienda tiene un stock máximo de azúcar que puede almacenar. Cada
          día paga un costo de almacenamiento por cada unidad de azúcar que
          tiene en stock.
        </li>
        <li>
          Si la tienda no tiene suficiente azúcar para satisfacer la demanda
          diaria, se genera demanda insatisfecha.
        </li>
        <li>
          Al final de cada semana, la tienda puede hacer un pedido de azúcar. El
          tiempo de entrega del pedido es una variable aleatoria que sigue una
          distribución uniforme entre un tiempo mínimo y un tiempo máximo.
        </li>
        <li>
          La tienda paga un costo de colocación de pedido y un costo unitario
          por cada unidad de azúcar que pide. La tienda siempre pedirá la
          cantidad necesaria para llegar al stock máximo.
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
              Semilla Demanda:
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
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla Tiempo de llegada:
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
              Stock máximo:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="maxStock"
                placeholder="Stock máximo"
                value={maxStock}
                onChange={(e) => checkIfIsValidNumber(e, setMaxStock)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Costo de colocación de pedido:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="orderPlacementCost"
                placeholder="Costo de colocación de pedido"
                value={orderPlacementCost}
                onChange={(e) =>
                  checkIfIsValidDecimal(e, setOrderPlacementCost)
                }
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Costo unitario de pedido:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="orderUnitCost"
                placeholder="Costo unitario de pedido"
                value={orderUnitCost}
                onChange={(e) => checkIfIsValidDecimal(e, setOrderUnitCost)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Precio de venta por unidad:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="unitSalePrice"
                placeholder="Precio de venta por unidad"
                value={unitSalePrice}
                onChange={(e) => checkIfIsValidDecimal(e, setUnitSalePrice)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Costo de almacenamiento:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="holdingCost"
                placeholder="Costo de almacenamiento"
                value={holdingCost}
                onChange={(e) => checkIfIsValidDecimal(e, setHoldingCost)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Tiempo mínimo de entrega:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="minTimeToDelivery"
                placeholder="Tiempo mínimo de entrega"
                value={minTimeToDelivery}
                onChange={(e) => checkIfIsValidNumber(e, setMinTimeToDelivery)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Tiempo máximo de entrega:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="maxTimeToDelivery"
                placeholder="Tiempo máximo de entrega"
                value={maxTimeToDelivery}
                onChange={(e) => checkIfIsValidNumber(e, setMaxTimeToDelivery)}
              />
            </span>
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Demanda promedio:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="averageDemand"
                placeholder="Demanda promedio"
                value={averageDemand}
                onChange={(e) => checkIfIsValidDecimal(e, setAverageDemand)}
              />
            </span>
            <span className="col-span-6"></span>
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
