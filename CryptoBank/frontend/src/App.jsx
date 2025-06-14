
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

const BANK_CONTRACT_ADDRESS = "0xcAE43783820E08e9dda696f7118848522D1e2e7D"; // Thay bằng địa chỉ contract mới
const BANK_ABI = [
  "function deposit() external payable",
  "function withdraw(uint256 amount) external",
  "function transfer(address to, uint256 amount) external",
  "function stake(uint256 amount) external",
  "function unstake() external",
  "function getBalance(address user) view returns (uint256)",
  "event Deposit(address indexed user, uint256 amount)",
  "event Withdrawal(address indexed user, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount, uint256 reward)"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [recipientBalance, setRecipientBalance] = useState("0"); // Thêm state cho số dư tài khoản nhận

  // Rút gọn địa chỉ ví
  const shortenAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  // Kết nối MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(BANK_CONTRACT_ADDRESS, BANK_ABI, signer);
        const accounts = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAccount(accounts);
        updateBalance(accounts, contract);
        toast.success("Đã kết nối ví MetaMask!");
      } catch (error) {
        console.error("Lỗi kết nối MetaMask:", error);
        toast.error("Không thể kết nối MetaMask!");
      }
    } else {
      toast.error("Vui lòng cài đặt MetaMask!");
    }
  };

  // Đăng xuất ví
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setBalance("0");
    setRecipientBalance("0");
    toast.success("Đã ngắt kết nối ví!");
  };

  // Cập nhật số dư
  const updateBalance = async (user, contractInstance) => {
    if (contractInstance && user) {
      try {
        const bal = await contractInstance.getBalance(user);
        setBalance(ethers.formatEther(bal));
      } catch (error) {
        console.error("Lỗi cập nhật số dư:", error);
        toast.error("Lỗi khi cập nhật số dư!");
      }
    }
  };

  // Cập nhật số dư tài khoản nhận
  const updateRecipientBalance = async (recipient, contractInstance) => {
    if (contractInstance && recipient) {
      try {
        const bal = await contractInstance.getBalance(recipient);
        setRecipientBalance(ethers.formatEther(bal));
      } catch (error) {
        console.error("Lỗi cập nhật số dư tài khoản nhận:", error);
        toast.error("Lỗi khi cập nhật số dư tài khoản nhận!");
      }
    }
  };

  // Xử lý nạp tiền
  const handleDeposit = async () => {
    if (!contract || !depositAmount) return;
    try {
      const tx = await contract.deposit({
        value: ethers.parseEther(depositAmount),
        gasLimit: 100000,
      });
      await tx.wait();
      updateBalance(account, contract);
      setDepositAmount("");
      toast.success("Nạp tiền thành công!");
    } catch (error) {
      console.error("Lỗi nạp tiền:", error);
      toast.error("Lỗi khi nạp tiền!");
    }
  };

  // Xử lý rút tiền
  const handleWithdraw = async () => {
    if (!contract || !withdrawAmount) return;
    try {
      const tx = await contract.withdraw(ethers.parseEther(withdrawAmount), { gasLimit: 100000 });
      await tx.wait();
      updateBalance(account, contract);
      setWithdrawAmount("");
      toast.success("Rút tiền thành công!");
    } catch (error) {
      console.error("Lỗi rút tiền:", error);
      toast.error("Lỗi khi rút tiền!");
    }
  };

  // Xử lý chuyển khoản
  const handleTransfer = async () => {
    if (!contract || !transferTo || !transferAmount) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      // Kiểm tra địa chỉ hợp lệ
      const isValidAddress = ethers.isAddress(transferTo);
      if (!isValidAddress) {
        toast.error("Địa chỉ người nhận không hợp lệ!");
        return;
      }

      const tx = await contract.transfer(transferTo, ethers.parseEther(transferAmount), { gasLimit: 150000 });
      await tx.wait();
      updateBalance(account, contract);
      updateRecipientBalance(transferTo, contract); // Cập nhật số dư tài khoản nhận
      setTransferTo("");
      setTransferAmount("");
      toast.success("Chuyển khoản thành công!");
    } catch (error) {
      console.error("Lỗi chuyển khoản:", error);
      toast.error(error.reason || "Lỗi khi chuyển khoản!");
    }
  };

  // Xử lý stake
  const handleStake = async () => {
    if (!contract || !stakeAmount) return;
    try {
      const tx = await contract.stake(ethers.parseEther(stakeAmount), { gasLimit: 150000 });
      await tx.wait();
      updateBalance(account, contract);
      setStakeAmount("");
      toast.success("Stake thành công!");
    } catch (error) {
      console.error("Lỗi stake:", error);
      toast.error("Lỗi khi stake!");
    }
  };

  // Xử lý rút stake
  const handleUnstake = async () => {
    if (!contract) return;
    try {
      const tx = await contract.unstake({ gasLimit: 200000 });
      await tx.wait();
      updateBalance(account, contract);
      toast.success("Rút stake thành công!");
    } catch (error) {
      console.error("Lỗi rút stake:", error);
      toast.error(error.reason || "Lỗi khi rút stake!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">CryptoBank</h1>
          {account ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
                {shortenAddress(account)}
              </span>
              <button
                onClick={disconnectWallet}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition duration-200"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition duration-200"
            >
              Kết nối MetaMask
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!account ? (
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">Chào mừng đến với CryptoBank</h2>
            <p className="text-gray-400 mb-6">Vui lòng kết nối ví MetaMask để bắt đầu.</p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg transition duration-200"
            >
              Kết nối ví
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wallet Info */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Thông tin ví</h2>
              <p className="text-gray-400 mb-2">Địa chỉ: {shortenAddress(account)}</p>
              <p className="text-2xl font-bold text-blue-400">Số dư: {balance} ETH</p>
            </div>

            {/* Deposit */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Nạp ETH</h2>
              <input
                type="number"
                placeholder="Số lượng ETH"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 border-gray-600 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleDeposit}
                className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition duration-200"
              >
                Nạp tiền
              </button>
            </div>

            {/* Withdraw */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Rút ETH</h2>
              <input
                type="number"
                placeholder="Số lượng ETH"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 border-gray-600 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleWithdraw}
                className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded-lg transition duration-200"
              >
                Rút tiền
              </button>
            </div>

            {/* Transfer */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Chuyển khoản ETH</h2>
              <input
                type="text"
                placeholder="Địa chỉ người nhận"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 border-gray-600 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Số lượng ETH"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 border-gray-600 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTransfer}
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg transition duration-200"
              >
                Chuyển khoản
              </button>
              {recipientBalance !== "0" && (
                <p className="text-gray-400 mt-4">
                  Số dư tài khoản nhận: {recipientBalance} ETH
                </p>
              )}
            </div>

            {/* Stake */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Stake ETH</h2>
              <input
                type="number"
                placeholder="Số lượng ETH"
                value={stakeAmount}
                onChange={(e) => setTransferTo(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 border-gray-600 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleStake}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg transition duration-200"
                >
                  Stake
                </button>
                <button
                  onClick={handleUnstake}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition duration-200"
                >
                  Rút Stake
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
