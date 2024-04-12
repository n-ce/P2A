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


async function handler(request, response) {

  const api = 'https://pipedapi.kavin.rocks';
  const { id } = request.query;

  if (!id)
    return response.send('Please enter a 11 letter id /id?={id}');

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

  const data = await fetch(`${api}/streams/${id}`)
    .then(res => res.json())
    .then(json => ({
      'id': id,
      'title': json.title,
      'author': json.uploader,
      'authorId': json.uploaderUrl.slice(9),
      'duration': convertSStoHHMMSS(data.duration),
      'thumbnailUrl': `https://i3.ytimg.com/vi_webp/${id}/mqdefault.webp`
    }))

  return response.send(data);
}

export default allowCors(handler);
