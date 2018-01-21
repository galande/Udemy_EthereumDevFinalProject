pragma solidity ^0.4.18;

import "./Mortal.sol";

contract MyWallet is Mortal{

  event fundRecived(address indexed _from, uint amount);
  event sentMoneyPlain(address indexed _from, address indexed _to, uint amount);
  event proposalRecieved(uint proposal_id, address indexed _from, address indexed _to, uint amount, string reason);
  event proposalConfirmed(uint proposal_id, address confirmedBy);

  struct Proposal{
    address from;
    address to;
    uint amount;
    string reason;
    bool sent;
  }

  mapping(uint => Proposal) m_proposals;

  uint proposal_id;

  function spendMoneyOn( address _to, uint amount, string _reason) public returns(uint){
    if(msg.sender == owner){
      _to.transfer(amount);
      sentMoneyPlain(msg.sender, _to, amount);
    }else{
      proposal_id ++;
      m_proposals[proposal_id] = Proposal(msg.sender, _to, amount, _reason, false);
      proposalRecieved(proposal_id, msg.sender, _to, amount, _reason);
      return proposal_id;
    }
  }

  function confirmProposal(uint _proposal_id) public onlyOwner returns(bool){
    if (m_proposals[_proposal_id].from != address(0)){
      if(m_proposals[_proposal_id].sent != true){
        m_proposals[_proposal_id].sent = true;
        m_proposals[_proposal_id].to.transfer(m_proposals[_proposal_id].amount);
        proposalConfirmed(_proposal_id, msg.sender);
        return true;
      }
    }
    return false;
  }

  function() payable public {
    if(msg.value > 0){
      fundRecived(msg.sender, msg.value);
    }
  }
}
