'use client';

import Form from 'next/form';
import Button from '#/ui/button';
import { PrefabTable } from '#/ui/tabletable';
import { useState } from 'react';
import {
  integerProgrammingSimulation,
  IntegerProgrammingRow,
} from '#/lib/integerProgramming';
import {
  checkIfIsValidNumber,
  checkIfIsValidDecimal,
} from '#/utils/validators';
import { Loader } from '#/ui/loader';
import InputErrorList from '#/ui/input-error';

export default function Page() {
  const [rows, setRows] = useState<IntegerProgrammingRow[]>([]);

  const columns = [
    { name: 'key', label: 'Iteración' },
    { name: 'x1', label: 'x1' },
    { name: 'x2', label: 'x2' },
    { name: 'z', label: 'Z' },
  ];

  const [simulationSummary, setSimulationSummary] = useState<{
    x1: number;
    x2: number;
    z: number;
  } | null>(null);

  // params
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const [c11, setC11] = useState('');
  const [c12, setC12] = useState('');
  const [c1b, setC1b] = useState('');
  const [c21, setC21] = useState('');
  const [c22, setC22] = useState('');
  const [c2b, setC2b] = useState('');
  const [N, setN] = useState('');

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
    const fN = parseInt(N, 10);
    const fA1 = parseFloat(a1);
    const fA2 = parseFloat(a2);
    const fC11 = parseFloat(c11);
    const fC12 = parseFloat(c12);
    const fC1b = parseFloat(c1b);
    const fC21 = parseFloat(c21);
    const fC22 = parseFloat(c22);
    const fC2b = parseFloat(c2b);

    // validate fields to not be empty
    if (isNaN(fSeed1)) errors.push('Complete el campo de la semilla 1');
    if (isNaN(fSeed2)) errors.push('Complete el campo de la semilla 2');
    if (isNaN(fA1)) errors.push('Complete el campo de A1');
    if (isNaN(fA2)) errors.push('Complete el campo de A2');
    if (isNaN(fC11)) errors.push('Complete el campo de C11');
    if (isNaN(fC12)) errors.push('Complete el campo de C12');
    if (isNaN(fC1b)) errors.push('Complete el campo de C1b');
    if (isNaN(fC21)) errors.push('Complete el campo de C21');
    if (isNaN(fC22)) errors.push('Complete el campo de C22');
    if (isNaN(fC2b)) errors.push('Complete el campo de C2b');
    if (isNaN(fN)) errors.push('Complete el campo de N');
    if (fN < 1) errors.push('El número de iteraciones debe ser mayor a 0');
    if (fSeed1 < 0) errors.push('La semilla 1 debe ser mayor a 0');
    if (fSeed2 < 0) errors.push('La semilla 2 debe ser mayor a 0');
    // validate is possible to achieve the constraints
    if (fC11 * 100 + fC12 * 100 < fC1b)
      errors.push('La restricción 1 no es posible de cumplir');
    if (fC21 * 100 + fC22 * 100 < fC2b)
      errors.push('La restricción 2 no es posible de cumplir');

    if (errors.length > 0) {
      setInputErrors([...errors]);
      setLoading(false);
      return;
    } else {
      setInputErrors([]);
    }

    console.log(`Debugging a params: ${fA1}; ${fA2}`);

    const simulationResult: {
      results: IntegerProgrammingRow[];
      optimalResult: { x1: number; x2: number; z: number };
    } = integerProgrammingSimulation(
      fN,
      fSeed1,
      fSeed2,
      fA1,
      fA2,
      fC11,
      fC12,
      fC1b,
      fC21,
      fC22,
      fC2b,
    );

    setRows(simulationResult.results);
    setSimulationSummary({
      x1: simulationResult.optimalResult.x1,
      x2: simulationResult.optimalResult.x2,
      z: simulationResult.optimalResult.z,
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
          <h2 className="text-lg font-bold">Valores Óptimos</h2>
          <div className="prose-lg">
            <p>
              <div className="text-sm">
                <span className="font-bold">x1:</span> {simulationSummary.x1}
              </div>
              <div className="text-sm">
                <span className="font-bold">x2:</span> {simulationSummary.x2}
              </div>
              <div className="text-sm">
                <span className="font-bold">Z:</span> {simulationSummary.z}
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
    setA1('');
    setA2('');
    setC11('');
    setC12('');
    setC1b('');
    setC21('');
    setC22('');
    setC2b('');
    setN('');
    setSimulationSummary(null);
    setToggleTable(false);
  };

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Maximización Problema de Programación lineal
      </h1>
      <ul>
        <li>
          El problema es maximizar una función objetivo sujeta a restricciones.
        </li>
        <li>
          Todas las restricciones son de la forma Cx1 + Dx2 {'>= b'}, donde C, D
          y b son constantes configurables y x1 y x2 son variables a optimizar.
        </li>
        <li>
          La simulación utiliza fuerza bruta para encontrar la mejor solución
          simulando valores aleatorios para x1 y x2 entre 0 y 100.
        </li>
        <li>
          Al cabo de N iteraciones, se selecciona la mejor solución que cumple
          con las restricciones.
        </li>
        <li>
          La función objetivo es Z = Ax1 + Bx2, donde A y B son constantes
          configurables.
        </li>
        <li>
          En los resultados solo se muestran las iteraciones que cumplen con las
          restricciones y aproximan la mejor solución.
        </li>
      </ul>
      <div className="flex gap-2">
        <div className="flex gap-2 md:col-span-2">
          <Form
            action="empty"
            onSubmit={handleSubmit}
            className="grid px-3 md:grid-cols-12"
          >
            {/* Iterations row */}
            <span className="col-span-3 pt-2 text-right text-sm font-medium md:pt-5">
              Cantidad de iteraciones:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="N"
                placeholder="Cantidad de juegos"
                value={N}
                onChange={(e) => checkIfIsValidNumber(e, setN)}
              />
            </span>
            <span className="col-span-6"></span>
            {/* Seeds row */}
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla X1:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed1"
                placeholder="Semilla X1"
                value={seed1}
                onChange={(e) => checkIfIsValidNumber(e, setSeed1)}
              />
            </span>
            <span className="col-span-2 pt-2 text-right text-sm font-medium md:pt-5">
              Semilla X2:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="seed2"
                placeholder="Semilla X2"
                value={seed2}
                onChange={(e) => checkIfIsValidNumber(e, setSeed2)}
              />
            </span>
            <span className="col-span-2"></span>

            {/* Target function row */}
            <span className="col-span-1 pt-2 text-right text-sm font-medium md:pt-5">
              Min Z =
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="a1"
                placeholder="A1"
                value={a1}
                onChange={(e) => checkIfIsValidDecimal(e, setA1)}
              />
            </span>
            <span className="col-span-1 pt-2 text-right text-sm font-medium md:pt-5">
              x1 +
            </span>

            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="a2"
                placeholder="A2"
                value={a2}
                onChange={(e) => checkIfIsValidDecimal(e, setA2)}
              />
            </span>
            <span className="col-span-1 pt-2 text-right text-sm font-medium md:pt-5">
              x2
            </span>
            <span className="col-span-3"></span>
            {/* First Condition row */}
            <span className="col-span-1 pt-2 text-right text-sm font-medium md:pt-5">
              C1:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="c11"
                placeholder="C11"
                value={c11}
                onChange={(e) => checkIfIsValidDecimal(e, setC11)}
              />
            </span>
            <span className="col-span-1 pt-2 text-right text-sm font-medium md:pt-5">
              x1 +
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="c12"
                placeholder="C12"
                value={c12}
                onChange={(e) => checkIfIsValidDecimal(e, setC12)}
              />
            </span>
            <span className="col-span-1 pt-2 text-right text-sm font-medium md:pt-5">
              x2 {'≥'}
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="c1b"
                placeholder="C1b"
                value={c1b}
                onChange={(e) => checkIfIsValidDecimal(e, setC1b)}
              />
            </span>
            {/* Second Condition row */}
            <span className="col-span-1 pt-2 text-right text-sm font-medium md:pt-5">
              C2:
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="c21"
                placeholder="C21"
                value={c21}
                onChange={(e) => checkIfIsValidDecimal(e, setC21)}
              />
            </span>
            <span className="col-span-1 pt-2 text-right text-sm font-medium md:pt-5">
              x1 +
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="c22"
                placeholder="C22"
                value={c22}
                onChange={(e) => checkIfIsValidDecimal(e, setC22)}
              />
            </span>
            <span className="col-span-1 pt-2 text-right text-sm font-medium md:pt-5">
              x2 {'≥'}
            </span>
            <span className="col-span-3">
              <input
                className="m-2 text-black"
                name="c2b"
                placeholder="C2b"
                value={c2b}
                onChange={(e) => checkIfIsValidDecimal(e, setC2b)}
              />
            </span>
            {/* Buttons row */}
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
