import { useEffect, useState } from "react";
import axios from "axios";

interface CoinGeckoPriceResponse {
  bitcoin: {
    usd: number;
    usd_market_cap?: number;
    usd_24h_change?: number;
    last_updated_at?: number;
  };
}

export default function BitcoinPrice(): JSX.Element {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPrice() {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<CoinGeckoPriceResponse>(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: {
            ids: "bitcoin",
            vs_currencies: "usd",
          },
        }
      );
      const btc = response.data.bitcoin;
      if (btc && typeof btc.usd === "number") {
        setPrice(btc.usd);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (err: unknown) {
      console.error("Ошибка при получении цены BTC:", err);

      if (axios.isAxiosError(err)) {
        setError(`Ошибка запроса: ${err.message}`);
      } else if (err instanceof Error) {
        setError(`Ошибка: ${err.message}`);
      } else {
        setError("Не удалось загрузить цену");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrice();
  }, []);

  return (
    <div>
      <h1>Цена BTC (USD)</h1>
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && price !== null && <p>${price}</p>}
      <button onClick={loadPrice}>Обновить</button>
    </div>
  );
}
