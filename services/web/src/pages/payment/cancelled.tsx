import api from "@/services/api";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const cancelOrder = async (orderId: any) => {
      await api
        .put(`/api/orders/${orderId}`, {
          id: Number(orderId),
          status: "cancelled",
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setTimeout(() => {
            router.replace("/");
          }, 3000);
        });
    };

    if (router.isReady && router.query.order_id) {
      cancelOrder(router.query.order_id);
    }
  }, [router.isReady]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24`}
    >
      <div>Aguarde...</div>
    </main>
  );
};

export default Page;
