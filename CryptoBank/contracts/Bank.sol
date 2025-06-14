// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CryptoBank {
mapping(address => uint256) public balances;
mapping(address => uint256) public stakedBalances;
mapping(address => uint256) public stakeTimestamps;
uint256 public constant STAKING_DURATION = 10; // Đã sửa để test nhanh
uint256 public constant REWARD_RATE = 1;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);

    function deposit() external payable {
        require(msg.value > 0, "So tien nap phai lon hon 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "So du khong du");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function transfer(address to, uint256 amount) external {
        require(to != address(0), "Dia chi khong hop le");
        require(balances[msg.sender] >= amount, "So du khong du");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    function stake(uint256 amount) external {
        require(balances[msg.sender] >= amount, "So du khong du");
        balances[msg.sender] -= amount;
        stakedBalances[msg.sender] += amount;
        stakeTimestamps[msg.sender] = block.number;
        emit Staked(msg.sender, amount);
    }

    function unstake() external {
        require(stakedBalances[msg.sender] > 0, "Khong co so stake");
        require(block.number >= stakeTimestamps[msg.sender] + STAKING_DURATION, "Chua den thoi gian rut stake");

        uint256 stakedAmount = stakedBalances[msg.sender];
        uint256 reward = (stakedAmount * REWARD_RATE) / 100;
        uint256 total = stakedAmount + reward;

        stakedBalances[msg.sender] = 0;
        stakeTimestamps[msg.sender] = 0;
        balances[msg.sender] += total;

        emit Unstaked(msg.sender, stakedAmount, reward);
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

}
