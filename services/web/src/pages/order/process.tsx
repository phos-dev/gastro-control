import api from "@/services/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const orderId = router.query.order_id;
  const sendOrderToQueue = async (orderId: any) => {
    await api
      .post(`/process-order/`, {
        order_id: Number(orderId),
      })
      .then(() => router.replace('/'))
      .catch((err) => console.log(err))
      .finally(() => {
        setTimeout(() => {
          router.replace("/");
        }, 3000);
      });
  };

  useEffect(() => {
    if (router.isReady && orderId) {
      sendOrderToQueue(orderId);
    }
  }, [router.isReady, orderId]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24`}
    >
      <div>Processando... </div>
    </main>
  );
};

export default Page;
