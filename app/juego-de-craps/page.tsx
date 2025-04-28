'use client';

import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import { useState } from 'react';
import { simulateGame, diceGameRow } from '#/lib/diceGame';
import {
  checkIfIsValidNumber,
  checkIfIsValidDecimal,
} from '#/utils/validators';
import { Loader } from '#/ui/loader';
import InputErrorList from '#/ui/input-error';
import { Boundary } from '#/ui/boundary';

export default function Page() {
  const [rows, setRows] = useState<diceGameRow[]>([]);

  const columns = [
    { name: 'key', label: 'Juego' },
    { name: 'dice1', label: 'Dado 1' },
    { name: 'dice2', label: 'Dado 2' },
    { name: 'sumDice', label: 'Suma Dados' },
    { name: 'win', label: 'Casa Gana' },
    { name: 'profits', label: 'Ganancias' },
  ];

  const [simulationSummary, setSimulationSummary] = useState<{
    totalEarnings: number;
    gamesWon: number;
    winPercentage: number;
  } | null>(null);

  // params
  const [maxGames, setMaxGames] = useState('');
  const [cost, setCost] = useState('');
  const [reward, setReward] = useState('');

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
    const fMaxGames = parseInt(maxGames, 10);
    const fCost = parseFloat(cost);
    const fReward = parseFloat(reward);

    // validate fields to not be empty
    if (isNaN(fSeed1)) errors.push('Complete el campo de la semilla 1');
    if (isNaN(fSeed2)) errors.push('Complete el campo de la semilla 2');
    if (isNaN(fMaxGames))
      errors.push('Complete el campo de la cantidad de juegos');
    if (isNaN(fCost)) errors.push('Complete el campo de la tarifa de entrada');
    if (isNaN(fReward)) errors.push('Complete el campo de la recompensa');

    if (errors.length > 0) {
      setInputErrors([...errors]);
      setLoading(false);
      return;
    } else {
      setInputErrors([]);
    }

    const simulationResult: {
      simulationDetails: diceGameRow[];
      totalEarnings: number;
      gamesWon: number;
      winPercentage: number;
    } = simulateGame(fMaxGames, fCost, fReward, fSeed1, fSeed2);

    setRows(simulationResult.simulationDetails);
    setSimulationSummary({
      totalEarnings: simulationResult.totalEarnings,
      gamesWon: simulationResult.gamesWon,
      winPercentage: simulationResult.winPercentage,
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
                Total de Ganancias: {simulationSummary.totalEarnings}.00 Bs
              </div>
              <div className="text-sm">
                Juegos Ganados: {simulationSummary.gamesWon}
              </div>
              <div className="text-sm">
                Porcentaje de Ganancia: {simulationSummary.winPercentage}%
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
    setMaxGames('');
    setCost('');
    setReward('');
    setSeed1('');
    setSeed2('');
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Simulación de un Juego de Suma 7</h1>
      <ul>
        <li>
          La simulación consiste en lanzar dos dados y ver si la suma es 7.
        </li>
        <li>
          en cada lanzamiento, el jugador gana si la suma es 7 y la casa paga
          una recompensa.
        </li>
        <li>
          El jugador pierde (la casa gana) si la suma no es 7 y la casa cobra
          una tarifa de entrada.
        </li>
        <li>
          El usuario puede elegir la cantidad de juegos a simular y los valores
          de la tarifa de entrada y la recompensa.
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
              Semilla Dado 1:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed1"
                placeholder="Semilla Dado 1"
                value={seed1}
                onChange={(e) => checkIfIsValidNumber(e, setSeed1)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla Dado 2:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed2"
                placeholder="Semilla Dado 2"
                value={seed2}
                onChange={(e) => checkIfIsValidNumber(e, setSeed2)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Cantidad de juegos a simular:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="maxGames"
                placeholder="Cantidad de juegos"
                value={maxGames}
                onChange={(e) => checkIfIsValidNumber(e, setMaxGames)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Costo de jugar:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="cost"
                placeholder="la casa cobra"
                value={cost}
                onChange={(e) => checkIfIsValidDecimal(e, setCost)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Recompensa por ganar:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="reward"
                placeholder="la casa paga"
                value={reward}
                onChange={(e) => checkIfIsValidDecimal(e, setReward)}
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
