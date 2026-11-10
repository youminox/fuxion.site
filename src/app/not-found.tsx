import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SHOP_TIENDA_URL } from "@/lib/data";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[65vh] flex items-center justify-center bg-[#EDF7FD]/40 py-20 px-4">
        <div className="max-w-xl w-full rounded-3xl border border-[#D7E4EC] bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="xrule mx-auto" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#0093DD] mb-2">
            Error 404 · FuXion Perú
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12232E] mb-4">
            Página no encontrada
          </h1>
          <p className="text-[#5A6B78] mb-8">
            La dirección que buscas no existe o ha cambiado. Puedes explorar todo
            nuestro catálogo oficial o ir directamente a la tienda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/tienda/" className="btn-fx btn-fx--buy w-full sm:w-auto">
              Ver Catálogo
            </Link>
            <a
              href={SHOP_TIENDA_URL}
              className="btn-fx btn-fx--ghost w-full sm:w-auto"
            >
              Ir a Tienda Oficial →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
