# Funcionalidades e critérios de aceitação

Status: caminhos abaixo foram encontrados nos fontes recuperados. Presença de código não significa homologação funcional nesta auditoria.

| Área | Evidência na origem | Verificação necessária |
| --- | --- | --- |
| Eventos e OPO | Planejamento: `app/api/events/route.ts`, `app/api/opo/route.ts` | Criar, filtrar e editar; exclusão autorizada, conflito de versão e vínculos de OPO |
| Estatísticas | Planejamento: `app/api/statistics/`, `lib/statistics-access.ts` | Agregados corretos; registros e URL de origem somente para os acessos autorizados |
| Planejamento, ENEM e Orla | Planejamento: `app/api/planning/`, `app/api/enem/`, `app/api/orla/` | Escopos, filtros e exportações coerentes com a tela |
| Mapas de pontos de PO | Planejamento: `components/po-projects.tsx`, `lib/po-map.ts`, `lib/po-export.ts` | Ruas/satélite/relevo, pontos e recorte do mapa no relatório |
| Mapa eleitoral | Eleições: `app/portal/area-map.tsx`, `app/api/public-locations/route.ts` | Nova aba por área; nome, zona e endereço em cada ponto; isolamento entre áreas |
| Relatórios eleitorais | Eleições: `app/api/guard-reports/`, `app/api/vote-reports/`, `app/api/officer-reports/` | Permissões, turno, totais, ausência de duplicação e filtros |
| Exportações | Dependências PDF, XLSX/ExcelJS e DOCX identificadas nos manifests | Conferir conteúdo, acentos, paginação, cabeçalhos e correspondência com filtros |

Requisitos recuperados do histórico, ainda a homologar contra a versão atual: relatórios em Arial 12 e texto justificado; mapa de PO em retrato com título do projeto; PDF de acompanhamento OPO com cabeçalho WOS, filtros, paginação e data/hora de Maceió. Não aplicar indiscriminadamente essas regras a telas ou formatos que não foram abrangidos pelo pedido original.
