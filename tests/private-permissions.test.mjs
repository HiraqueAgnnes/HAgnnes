import test from 'node:test';
import assert from 'node:assert/strict';
import {configuredCpfs} from '../apps/eleicoes/app/lib/private-permissions.ts';
test('listas de controle vêm da configuração privada e ausência não concede acesso',()=>{
  for(const name of ['ELECTION_REPORT_ADMIN_CPFS','ELECTION_GUARD_ADMIN_CPFS','ELECTION_AVAILABILITY_OWNER_CPF']) {
    assert.equal(configuredCpfs({},name).size,0);
    const settings={[name]:'00000000001'};
    assert.equal(configuredCpfs(settings,name).has('00000000001'),true);
    assert.equal(configuredCpfs(settings,name).has('00000000002'),false);
    settings[name]='00000000002';
    assert.equal(configuredCpfs(settings,name).has('00000000001'),false);
    assert.equal(configuredCpfs(settings,name).has('00000000002'),true);
    for(const value of ['*','all','00000000000','bad,00000000001','00000000001,'])assert.throws(()=>configuredCpfs({[name]:value},name),/Configuração privada inválida/);
  }
});
test('coordenação e controle de guarda/votação permanecem separados',()=>{
  const env={ELECTION_REPORT_ADMIN_CPFS:'00000000001',ELECTION_GUARD_ADMIN_CPFS:'00000000002,00000000003'};
  assert.equal(configuredCpfs(env,'ELECTION_REPORT_ADMIN_CPFS').has('00000000002'),false);
  assert.equal(configuredCpfs(env,'ELECTION_GUARD_ADMIN_CPFS').has('00000000001'),false);
  assert.equal(configuredCpfs(env,'ELECTION_GUARD_ADMIN_CPFS').size,2);
  assert.throws(()=>configuredCpfs({ELECTION_AVAILABILITY_OWNER_CPF:'00000000001,00000000002'},'ELECTION_AVAILABILITY_OWNER_CPF'));
});
