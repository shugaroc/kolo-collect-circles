
const LoadingWallet = () => {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="animate-pulse-scale">
        <div className="bg-kolo-purple rounded-full w-16 h-16 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">K</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingWallet;
