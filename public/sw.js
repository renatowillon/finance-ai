self.addEventListener('install', (event) => {
  console.log('[SW] Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Ativado');
});

self.addEventListener('fetch', (event) => {
  // Apenas obrigatório para o Chrome ativar como "PWA instalável"
});