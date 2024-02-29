import { Stripe, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import api from "@/services/api";
import Image from "next/image";

export default function Home() {
  const [stripe, setStripe] = useState<Stripe | null>();
  const products = [
    {
      src: "/img/lunch.webp",
      title: "Almoço",
      id: 'price_1Oh1ZfFJONQKqTu0tT591ZVT'
    },
    {
      src: "/img/dinner.png",
      title: "Jantar",
      id: 'price_1Ogf2uFJONQKqTu0QwXYoeri'
    },
  ];
  const buy = async (priceId: string) => {
    await api
      .post("/api/orders", {
        status: "pending",
      })
      .then(({ data }) => {
        api
          .post("/create-checkout-session/", {
            order_id: data.id,
            line_items: [
              {
                quantity: 1,
                price: priceId,
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
              status: "cancelled",
            });
          });
      });
  };

  useEffect(() => {
    api("/config/").then(async ({ data }) => {
      console.log(data.publicKey);
      await loadStripe(data.publicKey).then((v) => setStripe(v));
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 pt-5 gap-4">
      <div className="flex w-full text-[150px] justify-center items-center gap-5">
        <div>
          <Image src="/img/logo.png" alt="logo" height={200} width={200} />
        </div>
        <div>Gasto-Control</div>
      </div>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col border-[1px_solid_black] text-[30px] bg-white rounded-xl shadow-lg p-5 pt-2">
          <div>Bem-vindo ao Gasto-Control!</div>
          <span className="font-mono text-lg">
            Está cansado de enfrentar longas filas no Restaurante Rural? Com o
            Gasto-Control, você pode simplificar sua experiência de compra de
            tickets de forma rápida e conveniente. Nosso serviço oferece uma
            solução moderna e eficiente para aquisição de tickets.
            <br />
            <br /> Basta acessar nosso site, selecionar o número de tickets
            desejados e gerar seu QR code instantaneamente. Chega de desperdiçar
            tempo em filas intermináveis! Com o Gasto-Control, você ganha mais
            tempo para aproveitar suas refeições e focar no que realmente
            importa.
            <br />
            <br />
            Experimente hoje mesmo e descubra a praticidade de uma nova forma de
            comprar no Restaurante Universitário da UFRPE. Não perca tempo,
            CLique em Comprar e Seja feliz!
          </span>
        </div>
        <div className="w-full flex justify-center gap-8">
          {products?.map((product, key) => (
            <div
              key={key}
              className="bg-white flex flex-col overflow-hidden rounded-lg hover:cursor-pointer hover:opacity-65"
              onClick={() => buy(product.id)}
            >
              <Image
                src={product.src}
                alt={product.title}
                width={350}
                height={350}
                className="h-full object-cover"
              />
              <div className="w-full flex flex-col text-[50px] text-center">
                <span className="capitalize">Comprar {product.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex items-center justify-center text-[25px] py-6">
        <span>
          Gastro-Control© Projeto de Sistemas Distribuídos UFRPE - 2023.1
        </span>
      </div>
    </main>
  );
}
