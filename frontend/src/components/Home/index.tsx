import { useEffect, useState } from "react";
import { useToast } from "~/components/Toast";

export default function Home() {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const { showToast } = useToast();


  useEffect(() => {
    if (isStarted) {
      showToast({ message: "Hello, world!" });

      showToast({ message: "This is a test" });

      showToast({ message: "Toasts are great" });

      showToast({ message: "Aren't they?" });
    } else {
      setIsStarted(true);
    }
  }, [isStarted]);

  return (
    <div className="container">
      <div>Something beautiful</div>
    </div>
  );
}
