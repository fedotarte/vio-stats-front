// ts, чтобы тащил OrvalConfig
// чекнуть мутатор не через axios, а через сетевой слой
// 2 решения или флаги npx?
// пакет сделать только под платформу-импульс (не офр)
module.exports = {
  api: {
    input: './src/shared/api/api.json',
    output: {
      target: './src/shared/api/generated/endpoints/index.ts',
      schemas: './src/shared/api/generated/models',
      fileExtension: '.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/shared/api/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
      prettier: true,
    },
  },
};
