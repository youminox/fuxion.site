import Link from "next/link";
import { LEGAL_LOCATION, LEGAL_OWNER } from "@/lib/data";

interface AuthorBoxProps {
  updatedAt: string;
}

export default function AuthorBox({ updatedAt }: AuthorBoxProps) {
  return (
    <aside
      aria-label="Información del autor y descargo nutracéutico"
      className="my-10 rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/50 p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0093DD] text-white font-extrabold text-base grid place-items-center shrink-0">
            CL
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0093DD]">
              Guía elaborada y verificada por
            </p>
            <p className="text-base font-extrabold text-[#12232E]">
              {LEGAL_OWNER}
            </p>
            <p className="text-xs text-[#5A6B78] mt-0.5 leading-relaxed">
              Distribuidor Independiente Autorizado FuXion · {LEGAL_LOCATION}.
              Orientación práctica sobre catálogo oficial, preparación de bebidas
              funcionales y compra segura en Perú.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          <span className="text-xs font-semibold text-[#5A6B78]">
            Actualizado: <strong className="text-[#12232E]">{updatedAt}</strong>
          </span>
          <Link
            href="/sobre-nosotros/"
            className="text-xs font-bold text-[#0093DD] hover:underline"
          >
            Conocer respaldo oficial →
          </Link>
        </div>
      </div>

      <p className="mt-4 pt-3.5 border-t border-[#D7E4EC] text-xs text-[#5A6B78] leading-relaxed">
        <strong>Nota informativa:</strong> Los productos FuXion son alimentos
        nutracéuticos de origen natural (Clean Label); no son medicamentos ni
        sustituyen una dieta equilibrada ni un diagnóstico o tratamiento médico.
      </p>
    </aside>
  );
}
