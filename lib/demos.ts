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
        description: 'Create UI that is shared across routes',
      },
      {
        name: 'Productos Mínimos',
        slug: 'productos-minimos',
        description: 'Organize routes without affecting URL paths',
      },
      {
        name: 'Algoritmo Congruencial Lineal',
        slug: 'algoritmo-congruencial-lineal',
        description: 'Render multiple pages in the same layout',
      },
      {
        name: 'Algoritmo Congruencial Multiplicativo',
        slug: 'algoritmo-congruencial-multiplicativo',
        description: 'Render multiple pages in the same layout',
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
          'Create meaningful Loading UI for specific parts of an app',
      },
      {
        name: 'Estimación de Población',
        slug: 'estimacion-de-poblacion',
        description: 'Create Error UI for specific parts of an app',
      },
      {
        name: 'Juego de Craps',
        slug: 'juego-de-craps',
        description: 'Create Not Found UI for specific parts of an app',
      },
      {
        name: 'Problema de Maximización',
        slug: 'problema-de-maximizacion',
        description: 'Create Not Found UI for specific parts of an app',
      },
      {
        name: 'Llegada de Clientes',
        slug: 'llegada-de-clientes',
        description: 'Create Not Found UI for specific parts of an app',
      },
      {
        name: 'Problema de Huevos y Pollos',
        slug: 'problema-de-huevos-y-pollos',
        description: 'Create Not Found UI for specific parts of an app',
      },
      {
        name: 'Demanda y Pedido de Azúcar',
        slug: 'demanda-y-pedido-de-azucar',
        description: 'Create Not Found UI for specific parts of an app',
      },
    ],
  },
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
  },
];
