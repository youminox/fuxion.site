"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  DEFAULT_COUNTRY_CODE,
  getAllCountries,
  getCountryConfig,
  getProductsForCountry,
  isValidCountryCode,
  localizeProduct,
  type CountryCode,
  type CountryConfig,
  type LocalizedProduct,
  type Product,
} from "@/lib/data";

const STORAGE_KEY = "fx_country_v1";
const COOKIE_NAME = "fx_country";

const TIMEZONE_TO_COUNTRY: Record<string, CountryCode> = {
  // Peru
  "America/Lima": "pe",
  // Colombia
  "America/Bogota": "co",
  // Ecuador
  "America/Guayaquil": "ec",
  "Pacific/Galapagos": "ec",
  // Guatemala
  "America/Guatemala": "gt",
  // Mexico
  "America/Mexico_City": "mx",
  "America/Monterrey": "mx",
  "America/Cancun": "mx",
  "America/Merida": "mx",
  "America/Tijuana": "mx",
  "America/Chihuahua": "mx",
  "America/Mazatlan": "mx",
  "America/Hermosillo": "mx",
  "America/Matamoros": "mx",
  "America/Ojinaga": "mx",
  "America/Bahia_Banderas": "mx",
  // United States & PR
  "America/New_York": "us",
  "America/Chicago": "us",
  "America/Denver": "us",
  "America/Los_Angeles": "us",
  "America/Phoenix": "us",
  "America/Anchorage": "us",
  "Pacific/Honolulu": "us",
  "America/Detroit": "us",
  "America/Indiana/Indianapolis": "us",
  "America/Kentucky/Louisville": "us",
  "America/Boise": "us",
  "America/Puerto_Rico": "us",
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
}

function detectClientCountry(): CountryCode {
  if (typeof window === "undefined") return DEFAULT_COUNTRY_CODE;

  // 1. Check URL query param (?pais=co or ?country=mx)
  try {
    const params = new URLSearchParams(window.location.search);
    const q = (params.get("pais") || params.get("country") || "").toLowerCase();
    if (isValidCountryCode(q)) {
      return q;
    }
  } catch {
    // ignore
  }

  // 2. Check cookie set by middleware or previous selection
  const cookieVal = readCookie(COOKIE_NAME);
  if (isValidCountryCode(cookieVal)) {
    return cookieVal;
  }

  // 3. Check localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isValidCountryCode(stored)) {
      return stored;
    }
  } catch {
    // ignore
  }

  // 4. Detect from IANA Timezone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_TO_COUNTRY[tz]) {
      return TIMEZONE_TO_COUNTRY[tz];
    }
  } catch {
    // ignore
  }

  // 5. Detect from browser locale (e.g. es-CO, es-MX, es-EC, es-GT, en-US, es-US, es-PE)
  try {
    const langs = navigator.languages || [navigator.language];
    for (const lang of langs) {
      if (!lang) continue;
      const parts = lang.split(/[-_]/);
      const region = (parts[1] || "").toLowerCase();
      if (region === "pr") return "us";
      if (isValidCountryCode(region)) {
        return region;
      }
    }
  } catch {
    // ignore
  }

  return DEFAULT_COUNTRY_CODE;
}

interface CountryContextValue {
  countryCode: CountryCode;
  country: CountryConfig;
  countries: CountryConfig[];
  setCountryCode: (code: CountryCode) => void;
  localize: (product: Product) => LocalizedProduct;
  countryProducts: LocalizedProduct[];
}

const CountryContext = createContext<CountryContextValue | null>(null);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCodeState] =
    useState<CountryCode>(DEFAULT_COUNTRY_CODE);
  const countries = useMemo(() => getAllCountries(), []);

  useEffect(() => {
    const detected = detectClientCountry();
    setCountryCodeState(detected);
    writeCookie(COOKIE_NAME, detected);
    try {
      localStorage.setItem(STORAGE_KEY, detected);
    } catch {
      // ignore
    }
  }, []);

  const setCountryCode = useCallback((nextCode: CountryCode) => {
    if (!isValidCountryCode(nextCode)) return;
    setCountryCodeState(nextCode);
    writeCookie(COOKIE_NAME, nextCode);
    try {
      localStorage.setItem(STORAGE_KEY, nextCode);
    } catch {
      // ignore
    }
  }, []);

  const country = useMemo(
    () => getCountryConfig(countryCode),
    [countryCode]
  );

  const localize = useCallback(
    (product: Product) => localizeProduct(product, countryCode),
    [countryCode]
  );

  const countryProducts = useMemo(
    () => getProductsForCountry(countryCode),
    [countryCode]
  );

  const value = useMemo<CountryContextValue>(
    () => ({
      countryCode,
      country,
      countries,
      setCountryCode,
      localize,
      countryProducts,
    }),
    [countryCode, country, countries, setCountryCode, localize, countryProducts]
  );

  return (
    <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
  );
}

export function useCountry(): CountryContextValue {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    const fallbackCountry = getCountryConfig(DEFAULT_COUNTRY_CODE);
    return {
      countryCode: DEFAULT_COUNTRY_CODE,
      country: fallbackCountry,
      countries: getAllCountries(),
      setCountryCode: () => {},
      localize: (p: Product) => localizeProduct(p, DEFAULT_COUNTRY_CODE),
      countryProducts: getProductsForCountry(DEFAULT_COUNTRY_CODE),
    };
  }
  return ctx;
}
