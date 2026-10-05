// El dev-server de Angular consume el prefijo de contexto antes de
// reenviar; este rewrite vuelve a anteponer /api si el backend lo perdió.
module.exports = {
  '/api': {
    target: process.env.BEANFLOW_API_URL || 'http://localhost:8085',
    secure: false,
    rewrite: (path) => (path.startsWith('/api') ? path : `/api${path}`),
  },
};
