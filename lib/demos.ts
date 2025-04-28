export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const demos: { name: string; items: Item[] }[] = [
  {
    name: 'Números Pseudoaleatorios',
    items: [
      {
        name: 'Cuadrados Medios',
        slug: 'cuadrados-medios',
        description: 'Genera números aleatorios a partir de una semilla',
      },
      {
        name: 'Productos Medios',
        slug: 'productos-minimos',
        description: 'Genera números aleatorios a partir de dos semillas',
      },
      {
        name: 'Algoritmo Congruencial Lineal',
        slug: 'algoritmo-congruencial-lineal',
        description: 'Genera números aleatorios con una periodicidad calculada',
      },
      {
        name: 'Algoritmo Congruencial Multiplicativo',
        slug: 'algoritmo-congruencial-multiplicativo',
        description:
          'Genera números aleatorios con una periodicidad calculada y menos parámetros',
      },
    ],
  },
  {
    name: 'Modelos de Simulación',
    items: [
      {
        name: 'Calculo DPF',
        slug: 'calculo-dpf',
        description:
          'Calcula la ganancia esperada de realizar un Depósito a PLazo Fijo',
      },
      {
        name: 'Estimación de Población',
        slug: 'estimacion-de-poblacion',
        description: 'Simula el crecimiento de una población',
      },
      {
        name: 'Juego de Craps',
        slug: 'juego-de-craps',
        description: 'Simula un juego de azar',
      },
      {
        name: 'Problema de Maximización',
        slug: 'problema-de-maximizacion',
        description:
          'Simula la identificación de la solución de una programación entera',
      },
      {
        name: 'Llegada de Clientes',
        slug: 'llegada-de-clientes',
        description:
          'Simula la llegada de clientes a una tienda, y la cantidad de productos que compran',
      },
      {
        name: 'Problema de Huevos y Pollos',
        slug: 'problema-de-huevos-y-pollos',
        description: 'Simula la producción de huevos y pollos en una granja',
      },
      {
        name: 'Demanda y Pedido de Azúcar',
        slug: 'demanda-y-pedido-de-azucar',
        description: 'Create Not Found UI for specific parts of an app',
      },
    ],
  } /*,
  {
    name: 'Proyecto Final',
    items: [
      {
        name: 'Streaming with Suspense',
        slug: 'streaming',
        description:
          'Streaming data fetching from the server with React Suspense',
      },
    ],
  },*/,
];
