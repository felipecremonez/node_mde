# Node-MDE Web (Backend + Frontend)
Scaffold completo para um painel web que lista NF-e, permite manifestar ciência e baixar XMLs usando a biblioteca `node-mde`.

## O que foi gerado
- backend: API Express com endpoints protegidos por JWT, integração com `node-mde` (modo MOCK se lib não instalada), Dockerfile.
- frontend: SPA React (Vite) consumindo a API, Dockerfile para build + nginx.
- docker-compose.yml para subir frontend e backend localmente.
- .env.example e instruções.

## Como usar (local)
1. Copie seu certificado `.pfx` para `backend/certs/certificado.pfx` ou ajuste `CERT_PATH` no `.env.example`.
2. Configure `backend/.env.example` (CNPJ, CERT_PASS, JWT_SECRET).
3. Instale dependências e rode localmente (se preferir sem Docker):
   - Backend: `cd backend && npm install && npm run dev`
   - Frontend: `cd frontend && npm install && npm run dev`
4. Com Docker (recomendado para consistência):
   - `docker compose up --build`
   - Backend ficará em http://localhost:4000
   - Frontend em http://localhost:3000

## Observações de segurança
- **Nunca** versionar o arquivo .pfx.
- Troque o JWT_SECRET no `.env` por uma string forte em produção.
- Em produção, use HTTPS, armazenamento seguro para o certificado (KMS / Secret Manager) e controle de acesso.

## Integração real com node-mde
Os métodos expostos em `backend/services/mdeService.js` (`consultarNotasPorDestinatario`, `downloadXml`, `manifestar`) são ilustrativos; adpte-os conforme a API real da sua `node-mde`.

---
Boa sorte — personalizações e melhorias podem ser feitas conforme seu fluxo.
