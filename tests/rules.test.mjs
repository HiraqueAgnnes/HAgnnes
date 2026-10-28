import test from 'node:test';
import assert from 'node:assert/strict';
import {restrictStatisticalRecords} from '../apps/planejamento/lib/statistics-access.ts';
import {canDeleteEvent} from '../apps/planejamento/lib/event-deletion.ts';
import {locationCoordinates, coordinatesFromMaps} from '../apps/planejamento/lib/event-location.ts';
import {canReadAreaSchedule} from '../apps/eleicoes/app/lib/area-access.ts';

test('registros e fonte restritos; agregados preservados sem mutar o relatório', () => {
  const report={rows:[{name:'Pessoa sintética'}],sourceUrl:'https://example.invalid/restricted',total:1};
  for(const role of ['Master','Planejamento','Secretaria','Coordenação','Execução','Visitante','Convidado',null,undefined,'master','']) {
    const allowed=['Master','Planejamento'].includes(role);
    const result=restrictStatisticalRecords(report,role);
    assert.equal('rows' in result,allowed);
    assert.equal('sourceUrl' in result,allowed);
    assert.equal(result.canViewRecords,allowed);
    assert.equal(result.total,1);
  }
  assert.equal(report.rows.length,1);
  assert.ok(report.sourceUrl);
});

test('exclusão exige acesso explícito Master ou Secretaria', () => {
  for(const role of ['Master','Secretaria','Planejamento','Coordenação','Execução','Visitante','Convidado',null,undefined,'Comandante do CPRM'])
    assert.equal(canDeleteEvent(role),['Master','Secretaria'].includes(role));
});

test('escopo eleitoral não confunde áreas 1 e 10', () => {
  assert.equal(canReadAreaSchedule('Área de Policiamento Eleitoral 1',1),true);
  assert.equal(canReadAreaSchedule('Área de Policiamento Eleitoral 10',1),false);
  assert.equal(canReadAreaSchedule('Área de Policiamento Eleitoral 1',10),false);
  assert.equal(canReadAreaSchedule('TODAS ÁREAS DE POLICIAMENTO',10),true);
  assert.equal(canReadAreaSchedule('',1),false);
});

test('coordenadas aceitam decimal brasileiro e rejeitam pontos inválidos', () => {
  assert.deepEqual(locationCoordinates('-9,65','-35,73'),{latitude:-9.65,longitude:-35.73});
  assert.equal(locationCoordinates('',''),null);
  for(const pair of [[91,0],[0,181],['x',0],['',1]])assert.throws(()=>locationCoordinates(...pair));
  assert.deepEqual(coordinatesFromMaps('https://www.google.com/maps?q=-9.65,-35.73'),{latitude:-9.65,longitude:-35.73});
  assert.throws(()=>coordinatesFromMaps('https://google.com.example.invalid/maps?q=0,0'));
  assert.throws(()=>coordinatesFromMaps('http://www.google.com/maps?q=0,0'));
});
