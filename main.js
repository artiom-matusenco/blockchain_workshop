function t(s, d) {
  for (var p in d)
    s = s.replace(new RegExp('{{' + p + '}}', 'g'), d[p]);
  return s;
}

function getProposals() {
  const proposals = [
    {name: 'one', voteCount:4},
    {name: 'two', voteCount:4},
    {name: 'three', voteCount:6},
  ];

  return proposals.reduce((acc, p )=> {
    acc += `<li>${p.name}: ${p.voteCount}</li>`;
    return acc;
  }, '');
}


const contentValues = {
  logo: 'https://www.pets4homes.co.uk/images/breeds/13/large/3918021b2f92bd036598a095fb7e45de.jpg',
  title: 'Test Title',
  voteCount: 3,
  proposals: getProposals(),
}

const template = document.querySelector('template#content');
const html = t(template.innerHTML, contentValues);
const app = document.querySelector('.app');

app.innerHTML = html;
