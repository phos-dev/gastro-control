import api from "@/services/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

const Page = () => {
  const [src, setSrc] = useState();
  const router = useRouter();
  const orderId = router.query.order_id;

  useEffect(() => {
    if (router.isReady && orderId) {
      api
        .get(`/api/core?content=${orderId}`)
        .then(({ data }) => setSrc(data))
        .catch(() => {});
    }
  }, [router.isReady, orderId]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-4 p-24`}
    >
      <div>Mostre esse QRCode p/ processar!</div>
      <div>
        {src && (
          <a href={`/order/process?order_id=${orderId}`}>
            <Image src={src} alt={orderId as string} width={300} height={300} />
          </a>
        )}
      </div>
    </main>
  );
};

export default Page;
