import type { ReactNode } from "react";
import Link from "next/link";
import type { ArticleBlock, Product } from "@/lib/data";
import TransactionalProductCard from "@/components/TransactionalProductCard";

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Renders lightweight inline **bold** and [label](url) links safely without raw HTML injection.
 */
function RichInline({ text }: { text: string }) {
  const tokens: ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) {
      tokens.push(text.slice(lastIdx, match.index));
    }
    if (match[2] && match[3]) {
      const label = match[2];
      const href = match[3];
      if (href.startsWith("/")) {
        tokens.push(
          <Link
            key={key++}
            href={href}
            className="text-[#0093DD] font-semibold underline underline-offset-3 hover:text-[#007CBC]"
          >
            {label}
          </Link>
        );
      } else {
        tokens.push(
          <a
            key={key++}
            href={href}
            className="text-[#0093DD] font-semibold underline underline-offset-3 hover:text-[#007CBC]"
          >
            {label}
          </a>
        );
      }
    } else if (match[4]) {
      tokens.push(
        <strong key={key++} className="font-bold text-[#12232E]">
          {match[4]}
        </strong>
      );
    }
    lastIdx = pattern.lastIndex;
  }

  if (lastIdx < text.length) {
    tokens.push(text.slice(lastIdx));
  }

  return <>{tokens}</>;
}

interface ArticleBlocksRendererProps {
  blocks: ArticleBlock[];
  product: Product;
  cardPosition?: number;
  cardContextNote?: string;
}

export default function ArticleBlocksRenderer({
  blocks,
  product,
  cardPosition = 2,
  cardContextNote,
}: ArticleBlocksRendererProps) {
  const safeCardIdx = Math.min(
    Math.max(1, cardPosition),
    Math.max(1, blocks.length - 1)
  );

  const renderBlock = (block: ArticleBlock, idx: number) => {
    switch (block.type) {
      case "quick_answer":
        return (
          <section
            key={idx}
            className="my-6 rounded-2xl border-l-4 border-[#0093DD] bg-[#EDF7FD]/70 p-5 sm:p-6"
          >
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#0093DD] mb-1.5">
              {block.label || "Respuesta directa"}
            </p>
            <p className="text-base sm:text-[17px] text-[#12232E] leading-relaxed font-medium">
              <RichInline text={block.summary} />
            </p>
            {block.keyTakeaway && (
              <p className="mt-3 pt-3 border-t border-[#D7E4EC] text-sm text-[#2B3D4B]">
                <strong className="text-[#4E7A16]">Clave práctica: </strong>
                <RichInline text={block.keyTakeaway} />
              </p>
            )}
          </section>
        );

      case "prose": {
        const anchorId = block.id || slugifyHeading(block.heading);
        return (
          <section key={idx} id={anchorId} className="mt-8 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#12232E] pb-2 mb-4 border-b-2 border-[#EDF7FD]">
              {block.heading}
            </h2>
            <div className="space-y-4">
              {block.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-base sm:text-[16.5px] text-[#2B3D4B] leading-[1.78]"
                >
                  <RichInline text={p} />
                </p>
              ))}
            </div>
            {block.highlight && (
              <div className="mt-4 rounded-xl bg-[#F4FBE8] border border-[#CBE79E] px-4 py-3 text-sm text-[#1F3105]">
                <RichInline text={block.highlight} />
              </div>
            )}
          </section>
        );
      }

      case "steps": {
        const anchorId = block.id || slugifyHeading(block.heading);
        return (
          <section key={idx} id={anchorId} className="mt-9 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#12232E] pb-2 mb-3 border-b-2 border-[#EDF7FD]">
              {block.heading}
            </h2>
            {block.intro && (
              <p className="text-base text-[#2B3D4B] leading-relaxed mb-4">
                <RichInline text={block.intro} />
              </p>
            )}
            <ol className="space-y-3.5">
              {block.steps.map((step, sIdx) => (
                <li
                  key={sIdx}
                  className="rounded-2xl border border-[#D7E4EC] bg-white p-4 sm:p-5 flex items-start gap-4"
                >
                  <span className="w-8 h-8 rounded-full bg-[#0093DD] text-white font-extrabold text-sm grid place-items-center shrink-0 mt-0.5">
                    {sIdx + 1}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#12232E] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-[15.5px] text-[#2B3D4B] leading-relaxed">
                      <RichInline text={step.detail} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      }

      case "checklist": {
        const anchorId = block.id || slugifyHeading(block.heading);
        return (
          <section
            key={idx}
            id={anchorId}
            className="mt-9 rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/35 p-5 sm:p-7 scroll-mt-24"
          >
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#12232E] mb-2">
              {block.heading}
            </h2>
            {block.intro && (
              <p className="text-sm sm:text-base text-[#2B3D4B] leading-relaxed mb-4">
                <RichInline text={block.intro} />
              </p>
            )}
            <ul className="space-y-2.5">
              {block.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="flex items-start gap-3 rounded-xl bg-white border border-[#D7E4EC] p-3.5"
                >
                  <span className="w-5 h-5 rounded-full bg-[#E8F6D5] text-[#3B630C] font-extrabold text-xs grid place-items-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div className="text-sm sm:text-[15px] text-[#1E313E] leading-relaxed">
                    <strong className="text-[#12232E]">{item.label}</strong>
                    {item.detail ? (
                      <>
                        {" — "}
                        <RichInline text={item.detail} />
                      </>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      }

      case "myths": {
        const anchorId = block.id || slugifyHeading(block.heading);
        return (
          <section key={idx} id={anchorId} className="mt-9 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#12232E] pb-2 mb-4 border-b-2 border-[#EDF7FD]">
              {block.heading}
            </h2>
            <div className="space-y-3.5">
              {block.pairs.map((pair, pIdx) => (
                <div
                  key={pIdx}
                  className="rounded-2xl border border-[#D7E4EC] overflow-hidden grid grid-cols-1 md:grid-cols-2"
                >
                  <div className="bg-[#FFF6F6] p-4 border-b md:border-b-0 md:border-r border-[#D7E4EC]">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#B42318] mb-1">
                      Mito frecuente
                    </span>
                    <p className="text-sm text-[#12232E] font-semibold leading-relaxed">
                      <RichInline text={pair.myth} />
                    </p>
                  </div>
                  <div className="bg-[#F4FBE8]/70 p-4">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#3B630C] mb-1">
                      Realidad práctica
                    </span>
                    <p className="text-sm text-[#2B3D4B] leading-relaxed">
                      <RichInline text={pair.reality} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }

      case "comparison": {
        const anchorId = block.id || slugifyHeading(block.heading);
        return (
          <section key={idx} id={anchorId} className="mt-9 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#12232E] pb-2 mb-3 border-b-2 border-[#EDF7FD]">
              {block.heading}
            </h2>
            {block.intro && (
              <p className="text-sm sm:text-base text-[#2B3D4B] leading-relaxed mb-4">
                <RichInline text={block.intro} />
              </p>
            )}
            <div className="overflow-x-auto rounded-2xl border border-[#D7E4EC] shadow-xs">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#12232E] text-white text-xs uppercase tracking-wider">
                    {block.headers.map((h, hIdx) => (
                      <th key={hIdx} className="py-3 px-4 font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D7E4EC] bg-white">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#EDF7FD]/40">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-3 px-4 leading-relaxed ${
                            cIdx === 0
                              ? "font-bold text-[#12232E]"
                              : "text-[#2B3D4B]"
                          }`}
                        >
                          <RichInline text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      }

      case "menu_or_recipe": {
        const anchorId = block.id || slugifyHeading(block.heading);
        return (
          <section key={idx} id={anchorId} className="mt-9 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#12232E] pb-2 mb-3 border-b-2 border-[#EDF7FD]">
              {block.heading}
            </h2>
            {block.intro && (
              <p className="text-sm sm:text-base text-[#2B3D4B] leading-relaxed mb-4">
                <RichInline text={block.intro} />
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {block.entries.map((entry, eIdx) => (
                <div
                  key={eIdx}
                  className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/30 p-4"
                >
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#0093DD] mb-1">
                    {entry.label}
                  </p>
                  <p className="text-sm text-[#2B3D4B] leading-relaxed">
                    <RichInline text={entry.description} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      }

      case "timeline": {
        const anchorId = block.id || slugifyHeading(block.heading);
        return (
          <section key={idx} id={anchorId} className="mt-9 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#12232E] pb-2 mb-3 border-b-2 border-[#EDF7FD]">
              {block.heading}
            </h2>
            {block.intro && (
              <p className="text-sm sm:text-base text-[#2B3D4B] leading-relaxed mb-4">
                <RichInline text={block.intro} />
              </p>
            )}
            <div className="space-y-3 border-l-2 border-[#0093DD] pl-5 ml-2">
              {block.phases.map((ph, phIdx) => (
                <div key={phIdx} className="relative pb-2">
                  <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-[#8CC63F] ring-4 ring-white" />
                  <h3 className="text-base font-extrabold text-[#12232E]">
                    {ph.phase}
                  </h3>
                  <p className="text-sm text-[#2B3D4B] leading-relaxed mt-1">
                    <RichInline text={ph.focus} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      }

      case "callout": {
        const toneClasses =
          block.tone === "caution"
            ? "border-[#F5D0A9] bg-[#FFF9F2] text-[#5C3404]"
            : block.tone === "tip"
            ? "border-[#CBE79E] bg-[#F4FBE8] text-[#1F3105]"
            : "border-[#BFE3F7] bg-[#EDF7FD] text-[#0D3C55]";
        return (
          <aside
            key={idx}
            className={`my-7 rounded-2xl border p-5 ${toneClasses}`}
          >
            <p className="text-sm font-extrabold mb-1">{block.title}</p>
            <p className="text-sm leading-relaxed">
              <RichInline text={block.body} />
            </p>
          </aside>
        );
      }

      case "medical_notice": {
        const heading =
          block.heading || "¿Cuándo conviene consultar con un médico?";
        const anchorId = block.id || slugifyHeading(heading);
        return (
          <section
            key={idx}
            id={anchorId}
            className="mt-9 rounded-2xl border border-[#F3D2B3] bg-[#FFF8F1] p-5 sm:p-6 scroll-mt-24"
          >
            <h2 className="text-lg sm:text-xl font-extrabold text-[#6E3B08] mb-2">
              {heading}
            </h2>
            {block.intro && (
              <p className="text-sm text-[#5C3404] leading-relaxed mb-3">
                <RichInline text={block.intro} />
              </p>
            )}
            <ul className="space-y-1.5 text-sm text-[#4A2903]">
              {block.warningSigns.map((sign, wIdx) => (
                <li key={wIdx} className="flex items-start gap-2">
                  <span className="font-bold text-[#B45309] mt-0.5">•</span>
                  <span>
                    <RichInline text={sign} />
                  </span>
                </li>
              ))}
            </ul>
            {block.disclaimer && (
              <p className="mt-3 pt-3 border-t border-[#F3D2B3] text-xs text-[#6E3B08]">
                {block.disclaimer}
              </p>
            )}
          </section>
        );
      }
    }
  };

  return (
    <div>
      {blocks.map((block, idx) => (
        <div key={idx}>
          {renderBlock(block, idx)}
          {idx === safeCardIdx && (
            <TransactionalProductCard
              product={product}
              contextLabel={`Recomendación para tu objetivo · ${product.cleanName}`}
              uniqueNote={cardContextNote}
            />
          )}
        </div>
      ))}
    </div>
  );
}
