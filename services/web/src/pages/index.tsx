import Image from "next/image";
import { Inter } from "next/font/google";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import api from "@/services/api";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [stripe, setStripe] = useState<Stripe | null>();
  const buy = () => {
    api
      .post("/create-checkout-session/", {
        line_items: [
          {
            // name: "Almoço A",
            quantity: 1,
            price: 'price_1Oh1ZfFJONQKqTu0tT591ZVT'
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
      .then((res) => {
        console.log(res);
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
