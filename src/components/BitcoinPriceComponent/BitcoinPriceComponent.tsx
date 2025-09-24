import { useEffect, useState } from "react";

interface BitcoinData {
  bpi: {
    USD: {
      code: string;
      rate: string;
    };
  };
}

export default function Bitcoin(): JSX.Element {
  const [code, setCode] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function loadBitcoinData(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://api.coindesk.com/v1/bpi/currentprice.json"
      );

      if (!response.ok) {
        throw new Error("Ошибка сервера: " + response.status);
      }

      const data: BitcoinData = await response.json();
      const { code, rate } = data.bpi.USD;

      setCode(code);
      setRate(rate);
    } catch (err) {
      console.error("Ошибка загрузки Bitcoin:", err);
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBitcoinData();
  }, []);

  return (
    <div>
      <h1>Bitcoin Price</h1>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <p>Code: {code}</p>
          <p>Rate: {rate}</p>
        </>
      )}

      <button type="button" onClick={loadBitcoinData}>
        Refresh
      </button>
    </div>
  );
}
