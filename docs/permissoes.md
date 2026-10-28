# Permissões: evidência e limites

Inspeção dos commits registrados em `source-manifest.json`, em 28/10/2026. Regras abaixo foram lidas nos fontes; não houve autenticação nem teste contra produção.

## Planejamento

| Operação | Regra encontrada | Arquivo de origem |
| --- | --- | --- |
| Registros estatísticos individuais e URL de origem | Somente Acesso Master ou Planejamento; demais recebem agregados | `lib/statistics-access.ts` |
| Exclusão de evento | Somente Acesso Master ou Secretaria, sem inferir pela função | `lib/event-deletion.ts` |
| Editar evento | Master, Planejamento ou Secretaria | `lib/domain.ts` |
| Planejamento, OPO e Busca de Referências | Coluna Acesso Master ou Planejamento | `lib/domain.ts` |
| Inteligência | Master ou Planejamento com função P2/auxiliar P2 | `lib/domain.ts` |
| Convidado | Visão Geral, Estatística, Análise Criminal, Diagnóstico, Termos de Ajuste de Condutas e Orientações para eventos | `lib/domain.ts` |

A função `can` de domínio não é prova de que toda rota verifica autorização. Ainda é necessário confrontar cada endpoint com sua política, inclusive chamadas diretas e exportações. O código de sessão usa banco D1 e consulta uma fonte externa configurada por `PORTAL_ACCESS_URL`.

## Eleições

`app/lib/area-access.ts` permite leitura quando o texto de acesso concede todas as áreas de policiamento ou contém explicitamente o número da área eleitoral. Os testes verificam que área 1 não concede área 10, que o texto vazio nega acesso e que acentos/caixa são normalizados.

O código de autenticação recuperado usa diretório externo e assinatura de sessão com `APP_SESSION_SECRET`. A fonte do diretório ainda está fixa no código original e não foi reproduzida aqui. Não foi validada a cobertura de autorização de todas as APIs eleitorais.

## Testes incorporados

Os testes usam dados sintéticos e funções selecionadas copiadas sem alteração. Não contêm logins, CPFs reais, senhas nem acessos à rede. Testes completos por perfil e por endpoint permanecem pendentes da importação integral.
