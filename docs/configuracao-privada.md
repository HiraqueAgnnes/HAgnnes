# Fontes privadas e continuidade das escalas

Este incremento revisado prepara a autenticação eleitoral, leitura de planilhas, permissões de controle e abertura da pasta de escalas para configuração privada. O repositório ainda é parcial: não executar implantação deste checkout.

## Configuração do Eleições

Definir os valores no ambiente privado do Worker, nunca em arquivos versionados, issues, logs ou descrições de PR:

| Variável | Uso |
| --- | --- |
| `APP_SESSION_SECRET` | Assinatura de sessões; preservar a configuração existente durante a migração. |
| `ELECTION_LOGIN_URL` | Mesmo diretório XLSX de acesso utilizado pela instalação atual. |
| `ELECTION_WORKBOOK_1_URL` | Cópia histórica privada do 1º turno. Deve continuar apontando para a versão arquivada, com disponibilidade própria. |
| `ELECTION_WORKBOOK_2_URL` | Planilha do 2º turno que continua recebendo alterações. |
| `ELECTION_SCALES_FOLDER_URL` | Mesmo destino da pasta de escalas atualmente utilizada. |
| `ELECTION_REPORT_ADMIN_CPFS` | Lista privada, separada por vírgulas, dos atuais responsáveis por relatórios de oficial. |
| `ELECTION_GUARD_ADMIN_CPFS` | Lista privada, separada por vírgulas, dos atuais responsáveis por guarda e votação. |

As variáveis `ELECTION_*_EDIT_URL` reservam destinos de edição e inserção para integração posterior das telas. Não representam uma migração já realizada de todos os links da interface. Não alterar as permissões do provedor de arquivos durante a preparação.

## O que a preparação preserva

- As escalas continuam editáveis no provedor original; as URLs configuradas conservam caminho, consulta e fragmento. Os testes usam somente endereços fictícios.
- A leitura continua com `cache: no-store`, atualização nos mesmos horários e cache em memória compartilhado por turno. Alterar a configuração da URL invalida seu cache; editar o arquivo no mesmo link aparece na atualização periódica.
- Falha na atualização permite somente a última planilha validada daquela mesma fonte e turno, com aviso de desatualização. Sem essa cópia, a consulta falha explicitamente. Os antigos snapshots com dados pessoais não são incorporados ao repositório público, e dados fictícios nunca substituem uma escala operacional.
- O 1º turno mantém o bloqueio de escrita nas APIs e deve consultar um arquivo histórico privado. Não apontar sua configuração para uma planilha em edição.
- O caminho para abrir a pasta exige sessão assinada e acesso ainda presente no diretório. Diretório de autenticação e planilhas completas não são destinos de redirecionamento. Os futuros destinos de edição globais exigem acesso a todas as áreas; permissões específicas por área ainda precisam ser mapeadas na integração das telas.
- As listas de administradores são consultadas na configuração privada. Ausência não concede controle; configuração malformada falha explicitamente. Migrar os mesmos responsáveis antes de publicar qualquer integração.

## Sequência de adoção

1. Concluir a revisão dos demais dados, configurações, ativos e permissões na origem. O responsável pela disponibilidade e a correção histórica de CPF ainda não foram importados.
2. Configurar as mesmas fontes e permissões em ambiente isolado; manter intactos os destinos de edição e envio já utilizados.
3. Importar as telas e APIs restantes, substituir seus links por referências privadas e homologar leitura, edição, inserção e exportação com dados sintéticos.
4. Comprovar a equivalência dos fontes e artefatos, preparar retorno à versão anterior e somente então definir a implantação.

Esta alteração não publicou os Sites, não mudou suas variáveis, não editou planilhas nem substituiu PDFs de escalas em uso.
