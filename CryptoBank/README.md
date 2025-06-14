# CryptoBank
CryptoBank là một ứng dụng phi tập trung (DApp) mô phỏng ngân hàng trên blockchain Ethereum, cho phép người dùng nạp, rút, chuyển khoản, stake và unstake ETH thông qua ví MetaMask. Ứng dụng sử dụng **Ganache GUI** làm blockchain giả lập, **Solidity 0.8.21** cho smart contract, **React** với **TailwindCSS v3** cho giao diện, và **Ethers.js** để tương tác với contract. Giao diện được thiết kế hiện đại, lấy cảm hứng từ OKX Web3 Wallet, với tính năng đăng xuất và toast notification.

## Chức năng chính
1. **Kết nối ví MetaMask**:
   - Người dùng kết nối ví MetaMask để tương tác với contract.
   - Hiển thị địa chỉ ví (rút gọn) và số dư trong contract.

2. **Đăng xuất**:
   - Ngắt kết nối ví hiện tại và cho phép kết nối ví khác.

3. **Nạp ETH**:
   - Nạp ETH từ ví MetaMask vào contract, tăng số dư (`balances`).

4. **Rút ETH**:
   - Rút ETH từ contract về ví MetaMask, giảm số dư.

5. **Chuyển khoản ETH**:
   - Chuyển ETH từ số dư của người gửi sang số dư của tài khoản nhận trong contract.
   - Hiển thị số dư tài khoản nhận sau khi chuyển khoản thành công.

6. **Stake ETH**:
   - Khóa ETH trong contract để nhận lãi (1% sau 10 block).
   - Chuyển ETH từ `balances` sang `stakedBalances`.

7. **Unstake ETH**:
   - Rút ETH đã stake cùng phần thưởng sau 10 block.
   - Chuyển tổng số (ETH + thưởng) về `balances`.

8. **Kiểm tra số dư**:
   - Xem số dư trong contract của tài khoản hiện tại hoặc tài khoản nhận.

## Yêu cầu
- **Node.js**: Phiên bản 14.x hoặc cao hơn ([nodejs.org](https://nodejs.org)).
- **MetaMask**: Cài trên Chrome/Firefox ([metamask.io](https://metamask.io)).
- **Ganache GUI**: Blockchain giả lập ([trufflesuite.com/ganache](https://trufflesuite.com/ganache)).
- **Truffle**: Framework Ethereum (`npm install -g truffle`).
- Trình chỉnh sửa mã (VSCode khuyến nghị).

## Cài đặt
1. **Clone dự án**:
   ```bash
   git clone <repository-url>
   cd CryptoBank
   ```

2. **Cài đặt Truffle**:
   ```bash
   npm install -g truffle
   ```

3. **Cài đặt dependencies cho backend**:
   Trong thư mục gốc (`CryptoBank`):
   ```bash
   npm install web3
   ```

4. **Cài đặt dependencies cho frontend**:
   Trong thư mục `frontend`:
   ```bash
   cd frontend
   npm install
   ```

5. **Cấu hình Ganache GUI**:
   - Tải và cài Ganache GUI.
   - Mở Ganache, chọn **Quickstart** hoặc tạo workspace mới.
   - Vào **Settings > Server**:
     - **Port Number**: `8545`.
     - **Network ID**: `1337`.
   - Vào **Settings > Chain**:
     - **Gas Price**: 20 Gwei.
     - **Gas Limit**: 10,000,000.
   - Lưu và khởi động lại (**Save and Restart**).
   - Ghi lại **Mnemonic** và **Private Key** của các tài khoản (tab **Accounts**).

6. **Cấu hình MetaMask**:
   - Cài MetaMask, đăng nhập hoặc tạo ví.
   - Thêm mạng Ganache:
     - **Network Name**: Ganache
     - **RPC URL**: `http://127.0.0.1:8545`
     - **Chain ID**: `1337`
     - **Currency Symbol**: ETH
   - Nhập 2-3 tài khoản từ Ganache (dùng private key).

## Triển khai Smart Contract
1. **Kiểm tra cấu hình Truffle**:
   - File `truffle-config.js`:
     ```javascript
     module.exports = {
       networks: {
         development: {
           host: "127.0.0.1",
           port: 8545,
           network_id: "1337",
           gas: 6721975,
           gasPrice: 20000000000,
         },
       },
       compilers: {
         solc: {
           version: "0.8.19",
           settings: {
             optimizer: {
               enabled: true,
               runs: 200,
             },
           },
         },
       },
     };
     ```

2. **Triển khai contract**:
   - Trong thư mục `CryptoBank`:
     ```bash
     truffle migrate --network development --reset
     ```
   - Ghi lại **địa chỉ contract** từ terminal hoặc Ganache GUI (tab **Contracts**).

3. **Cập nhật địa chỉ contract trong frontend**:
   - Mở `frontend/src/App.jsx`.
   - Thay `YOUR_CONTRACT_ADDRESS_HERE` bằng địa chỉ contract:
     ```jsx
     const BANK_CONTRACT_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678";
     ```

## Chạy ứng dụng
1. **Khởi động Ganache GUI**:
   - Đảm bảo blockchain chạy với Chain ID `1337` và port `8545`.

2. **Chạy frontend**:
   - Trong thư mục `frontend`:
     ```bash
     cd frontend
     npm run dev
     ```
   - Mở `http://localhost:5173` trong trình duyệt.

3. **Tương tác với ứng dụng**:
   - **Kết nối ví**: Nhấn **Kết nối MetaMask**, chọn tài khoản.
   - **Nạp ETH**: Nhập số lượng (ví dụ: 2 ETH), nhấn **Nạp tiền**.
   - **Rút ETH**: Nhập số lượng (ví dụ: 1 ETH), nhấn **Rút tiền**.
   - **Chuyển khoản**:
     - Nhập địa chỉ tài khoản nhận (từ Ganache GUI).
     - Nhập số lượng (ví dụ: 0.5 ETH), nhấn **Chuyển khoản**.
     - Kiểm tra số dư tài khoản nhận hiển thị trong card "Chuyển khoản ETH".
   - **Stake**:
     - Nhập số lượng (ví dụ: 0.3 ETH), nhấn **Stake**.
   - **Unstake**:
     - Tạo 10 block để đủ điều kiện rút:
       ```bash
       truffle console --network development
       ```
       ```javascript
       for (let i = 0; i < 10; i++) {
         await network.provider.send("evm_mine");
       }
       ```
     - Nhấn **Rút Stake**.
   - **Đăng xuất**: Nhấn **Đăng xuất** để kết nối ví khác.

## Kiểm tra số dư tài khoản nhận
- Sau khi chuyển khoản, số dư tài khoản nhận hiển thị trong card "Chuyển khoản ETH".
- Để kiểm tra thủ công:
  - Kết nối MetaMask với tài khoản nhận, xem số dư trong card "Thông tin ví".
  - Hoặc dùng Truffle Console:
    ```bash
    truffle console --network development
    ```
    ```javascript
    let contract = await CryptoBank.at("YOUR_CONTRACT_ADDRESS_HERE");
    let balance = await contract.getBalance("0xdef...456");
    console.log(ethers.utils.formatEther(balance));
    ```

## Khắc phục lỗi
1. **Lỗi "Transaction Reverted"**:
   - Kiểm tra địa chỉ nhận hợp lệ, số dư đủ, hoặc đủ block cho unstake.
   - Xem lỗi trong console trình duyệt (F12 > Console) hoặc Ganache GUI (tab **Transactions**).

2. **Lỗi "Out of Gas"**:
   - Tăng `gasLimit` trong `frontend/src/App.jsx` (ví dụ: 200,000 cho `transfer`).
   - Tăng **Gas Limit** trong Ganache GUI (**Settings > Chain**).

3. **Số dư tài khoản nhận không đổi**:
   - Đảm bảo địa chỉ nhận đúng (copy từ Ganache GUI).
   - Kiểm tra giao dịch trong Ganache GUI (tab **Transactions**).

4. **Giao diện không hiển thị**:
   - Kiểm tra TailwindCSS trong `frontend/src/index.css` và `frontend/tailwind.config.js`.
   - Chạy lại `npm run dev`.

## Lưu ý
- **Số dư trong contract**: Các chức năng (`transfer`, `stake`, `unstake`) chỉ thay đổi `balances` trong contract, không phải số dư ví gốc.
- **Gas**: Gas trong Ganache là mô phỏng, không tốn ETH thực tế.
- **Bảo mật**: Thêm reentrancy guard cho `Bank.sol` nếu dùng thực tế.
- **STAKING_DURATION**: Đặt 10 block để test nhanh.

## Tác giả
## Nguyễn Quang Dũng
Dự án được phát triển để học và thử nghiệm blockchain. Liên hệ để đóng góp hoặc hỗ trợ!
