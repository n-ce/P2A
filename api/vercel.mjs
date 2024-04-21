const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

function convertSStoHHMMSS(seconds) {
  if (seconds < 0) return '';
  const hh = Math.floor(seconds / 3600);
  seconds %= 3600;
  const mm = Math.floor(seconds / 60);
  const ss = Math.floor(seconds % 60);
  let mmStr = String(mm);
  let ssStr = String(ss);
  if (mm < 10) mmStr = '0' + mmStr;
  if (ss < 10) ssStr = '0' + ssStr;
  return (hh > 0 ?
    hh + ':' : '') + `${mmStr}:${ssStr}`;
}

const instanceArray = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.leptons.xyz',
  'https://piped-api.lunar.icu',
  'https://pipedapi.r4fo.com',
  'https://pipedapi-libre.kavin.rocks',
  'https://api.piped.projectsegfau.lt',
  'https://pipedapi.us.projectsegfau.lt',
  'https://api.piped.privacydev.net',
  'https://pipedapi.smnz.de',
  'https://pipedapi.adminforge.de',
  'https://pipedapi.astartes.nl',
  'https://pipedapi.drgns.space',
  'https://piapi.ggtyler.dev',
  'https://pipedapi.ducks.party',
  'https://pipedapi.ngn.tf',
  'https://piped-api.codespace.cz',
  'https://pipedapi.reallyaweso.me'
];


async function handler(request, response) {

  const api = instanceArray[Math.floor(Math.random() * instanceArray.length)];

  const { id } = request.query;

  if (!id)
    return response.send('Please enter a 11 letter id /id?={id}');


  const data = await fetch(`${api}/streams/${id}`)
    .then(res => res.json())
    .then(json => ({
      'id': id,
      'title': json.title,
      'author': json.uploader,
      'authorId': json.uploaderUrl.slice(9),
      'duration': convertSStoHHMMSS(json.duration),
      'thumbnailUrl': `https://i3.ytimg.com/vi_webp/${id}/mqdefault.webp`
    }))

  return response.send(data);
}

export default allowCors(handler);
