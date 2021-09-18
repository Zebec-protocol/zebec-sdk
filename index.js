export default function Connect(cluster) {
  let connection = new Connection(clusterApiUrl(cluster));
  window.solana.on("connect", async () => {
  console.log('wallet connected');
  });
  window.solana.connect();
};