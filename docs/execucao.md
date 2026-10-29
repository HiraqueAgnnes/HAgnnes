# Execução, dados e implantação

## Estado atual

O incremento de 29/10/2026 acrescenta módulos revisados de autenticação, leitura das planilhas eleitorais, permissões e abertura da pasta de escalas. Consultar [configuração privada](configuracao-privada.md) antes de integrar esses módulos à aplicação completa. O checkout público continua parcial.

Este checkout público é parcial. Não há comandos de instalação/build válidos para executar o portal completo aqui. Os `package.json` e lockfiles dentro de `apps/` são cópias de referência dos aplicativos originais, com scripts cujos arquivos ainda não foram importados.

Os fontes originais usam React 19.2.6, Next 16.3.4, Vinext 1.0.0-beta.5, TypeScript 5.9.3, Vite 8.0.13, Drizzle e Cloudflare Workers. Seus manifests declaram Node >=22.13.0 e pnpm 11.25.0. São versões observadas, não recomendações de atualização.

## Dados

- Planejamento: bindings `DB` (D1) e `BUCKET` (R2); variáveis `PORTAL_ACCESS_URL` e `COPOM_DATA_KEY` identificadas no código.
- Eleições: uso de `DB` e `APP_SESSION_SECRET` identificado; o diretório de acesso precisa ser externalizado antes da cópia pública do módulo de autenticação.
- Foram copiados esquemas e migrações estruturais. Não foram exportados bancos, sessões, uploads, escalas nem diretórios de usuários.
- As 11 migrações de Planejamento e 9 de Eleições aplicaram em bancos SQLite vazios, criando respectivamente 15 e 14 tabelas. Isso não prova migração de banco já populado nem compatibilidade integral do ambiente D1.

## Próxima importação

1. Trabalhar em cópia dos fontes dos commits registrados no manifesto; preservar origens e dados de produção.
2. Substituir referências privadas fixas por configuração privada; nenhum valor real no `.env.example`.
3. Separar dados operacionais e ativos que não podem ser redistribuídos; fornecer fixtures sintéticas compatíveis.
4. Importar o código completo e dependências; instalar pelo lockfile; executar testes existentes e build.
5. Homologar APIs, mapas e exportações com base isolada; revisar permissões e migrações.
6. Só conectar este repositório ao fluxo de implantação depois de comprovar equivalência e preparar retorno à versão anterior.

Não houve implantação nem alteração das configurações dos Sites nesta tarefa. A versão observada no Sites e o HEAD de origem foram coletados separadamente; não foi comprovado que cada HEAD corresponde exatamente ao artefato publicado.
