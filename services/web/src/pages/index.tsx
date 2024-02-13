import { Inter } from "next/font/google";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import api from "@/services/api";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [stripe, setStripe] = useState<Stripe | null>();
  const buy = async () => {
    await api.post("/api/orders", {
      status: "pending"
    }).then(({ data }) => {
      api
        .post("/create-checkout-session/", {
          order_id: data.id,
          line_items: [
            {
              // name: "Almoço A",
              quantity: 1,
              price: "price_1Oh1ZfFJONQKqTu0tT591ZVT",
              // images: ["https://www.designi.com.br/images/preview/11039800.jpg"],
            },
          ],
        })
        .then(({ data }) => {
          console.log(data);
          return stripe!.redirectToCheckout({
            sessionId: data.sessionId,
          });
        })
        .catch(() => {
          api.put(`/api/orders/${data.id}`, {
            id: data.id,
            status: "cancelled"
          })
        });
    });
  };

  useEffect(() => {
    api("/config/").then(async ({ data }) => {
      console.log(data.publicKey)
      await loadStripe(data.publicKey).then((v) => setStripe(v));
    });
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      
      <button onClick={buy}>Comprar Almoço</button>
    </main>
  );
}
