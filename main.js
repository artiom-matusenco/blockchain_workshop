const contentValues = {
  logo: 'https://www.pets4homes.co.uk/images/breeds/13/large/3918021b2f92bd036598a095fb7e45de.jpg',
  title: 'Test Title',
  proposals: [],
}

function t(s, d) {
  for (var p in d)
    s = s.replace(new RegExp('{{' + p + '}}', 'g'), d[p]);
  return s;
}

function applyVote(hash) {
  pify(contract.vote)(hash).then(() => render());
}

function getVoteHtml(p) {
  if (contentValues.hasVoted) {
    return '';
  }
  return `<button id="vote-btn" data-value="${p.name}" onClick="applyVote('${p.hash}')">Vote</button>`;
}



function getProposals(proposals) {
  return proposals.reduce((acc, p )=> {
    const vote = getVoteHtml(p);
    acc += `<li>
      ${p.name} ${p.voteCount}
      ${vote}
    </li>`;
    return acc;
  }, '');
}




function render() {
  const template = document.querySelector('template#content');
  const html = t(template.innerHTML, contentValues);
  const app = document.querySelector('.app');

  app.innerHTML = html;
}

const {web3} = window;
if(!web3) {
  throw new Error('Meta Mask is not connected');
}
const abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
        }
    ],
    "name": "proposals",
    "outputs": [
      {
        "name": "name",
        "type": "bytes32"
        },
      {
        "name": "voteCount",
        "type": "uint256"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
  {
    "constant": true,
    "inputs": [],
    "name": "totalVoteCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
        }
    ],
    "name": "voters",
    "outputs": [
      {
        "name": "voted",
        "type": "bool"
        },
      {
        "name": "vote",
        "type": "bytes32"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
  {
    "constant": true,
    "inputs": [],
    "name": "website",
    "outputs": [
      {
        "name": "",
        "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
  {
    "constant": true,
    "inputs": [],
    "name": "logo",
    "outputs": [
      {
        "name": "",
        "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
  {
    "inputs": [
      {
        "name": "proposalsNames",
        "type": "bytes32[]"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
    },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "voter",
        "type": "address"
        },
      {
        "indexed": false,
        "name": "proposal",
        "type": "bytes32"
        }
    ],
    "name": "Voted",
    "type": "event"
    },
  {
    "constant": true,
    "inputs": [],
    "name": "getProposals",
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
  {
    "constant": false,
    "inputs": [
      {
        "name": "proposalName",
        "type": "bytes32"
        }
    ],
    "name": "vote",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
    },
  {
    "constant": true,
    "inputs": [
      {
        "name": "voter",
        "type": "address"
        }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "name": "",
        "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
  {
    "constant": true,
    "inputs": [
      {
        "name": "voter",
        "type": "address"
        }
    ],
    "name": "getVote",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
  {
    "constant": true,
    "inputs": [
      {
        "name": "proposal",
        "type": "bytes32"
        }
    ],
    "name": "getProposalVoteCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
  {
    "constant": true,
    "inputs": [],
    "name": "getLeader",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    }
];

// setTimeout(processContract, 3000);

function processContract() {
  const address = '0xb59eB8751480F9F897632B4165caE06675052f0A';
  const contract = web3.eth.contract(abi).at(address);
  window.contract = contract;
  return contract;
}

const contract = processContract();

let proposals = [];

window.onload = () => {

pify(web3.eth.getAccounts)()
.then(() =>
  Promise.all([pify(contract.getProposals.call)()
    .then((data) => {
      proposals = data;
    })
      .then(() => {

        const promises = [];
        for (let i = 0; i < proposals.length; i++) {
          const arg = proposals[i];
          promises.push(pify(contract.getProposalVoteCount.call)(arg));
        }
        return Promise.all(promises);
      })
      .then((votes) => {
        const resultProposals = [];
        votes.forEach((vote, i) => {
          const voteCount = vote.toString();

          resultProposals.push({
            name: web3.toUtf8(proposals[i]),
            voteCount,
            hash: proposals[i],
          });

        });
        contentValues.proposals = getProposals(resultProposals);
      }),
      pify(contract.name.call)().then(name => contentValues.title = name),
      pify(contract.logo.call)().then(logo => contentValues.logo = logo),
      pify(contract.hasVoted.call)(web3.eth.defaultAccount).then(hasVoted => contentValues.hasVoted = hasVoted),
  ])
    .then(() => {
      render();
    })
  );
}
