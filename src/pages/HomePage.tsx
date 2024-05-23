import { usePrefetchTreatments } from "@/hooks/treatments/useTreatments";

const HomePage = () => {
  usePrefetchTreatments();
  return <div>HomePage</div>;
};

export default HomePage;
