import LatestMatcha from "./components/LatestMatcha";
import LatestShops from "./components/LatestShops";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-8 mt-6">
      <div className="w-full">
        <h2 className="text-center text-lg">最新の抹茶</h2>
        <LatestMatcha />
      </div>
      <div className="w-full">
        <h2 className="text-center text-lg">最近のお店</h2>
        <LatestShops />
      </div>
    </div>
  );
};

export default Home;
