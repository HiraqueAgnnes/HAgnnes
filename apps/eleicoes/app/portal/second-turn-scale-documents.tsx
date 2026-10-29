import {sourceLink} from "@/app/lib/private-sources";
import { canReadAreaSchedule } from "@/app/lib/area-access";
import { ExternalLink, FileText } from "lucide-react";

export const secondTurnScalesFolder = sourceLink("ELECTION_SCALES_FOLDER_URL");

export default function SecondTurnScaleDocuments({ access }: { access: string }) {
  const areas = Array.from({ length: 9 }, (_, i) => i + 1).filter(area => canReadAreaSchedule(access, area));
  return <>
    <div className="schedule-tabs">
      {[
        { title: "Oficial de Ligação", icon: "/icone-oficial-ligacao.png", files: [
          { title: "Escala de Oficial de Ligação", href: "/docs/Escala_Oficial_Ligacao_2_Turno.pdf" },
          { title: "Escala da Guarnição do Oficial de Ligação", href: "/docs/Escala_Guarnicao_Oficial_Ligacao_2_Turno.pdf" },
        ] },
        { title: "Guarda Urna", icon: "/icone-guarda-urna.png", date: "24/10/2026", files: areas.map(area => ({title: `Guarda Urna — Área ${area}`, href: `/api/guard-urna/${area}`})) },
        { title: "Dia de Votação", icon: "/icone-dia-votacao.png", date: "25/10/2026", files: areas.map(area => ({title: `Pleito Eleitoral — Área ${area}`, href: `/api/dia-votacao/${area}`})) },
      ].map(group => <section className="content-card" key={group.title}>
        <img className="mission-icon" src={group.icon} alt="" />
        <h3>{group.title}</h3>
        <p>2º turno{group.date ? ` · ${group.date}` : ""}</p>
        <div className="schedule-pdf-links">
          {group.files.map(file => <a href={file.href} key={file.href} target="_blank" rel="noopener noreferrer"><FileText aria-hidden="true" /><span>{file.title} — PDF</span><ExternalLink aria-hidden="true" /></a>)}
        </div>
        {!group.files.length && <p>Nenhuma escala disponível para as áreas autorizadas.</p>}
      </section>)}
    </div>
    <p className="officer-report-note"><a href={secondTurnScalesFolder} target="_blank" rel="noopener noreferrer">Abrir repositório das escalas do 2º turno no Dropbox ↗</a></p>
  </>;
}
