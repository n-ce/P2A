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

async function handler(_, response) {

  const api = 'https://api.invidious.io/instances.json';

  const instances = await fetch(api)
    .then(res => res.json())
    .then(json => json.filter(i => i[1].cors && i[1].api && i[1].type === 'https').map(i => {
      const url = i[1].uri;
      const splitter = url.split('.');
      const len = splitter.length;
      const name = `${splitter[len - 2]}.${splitter[len - 1]} ${i[1].flag}`;
      return `${name},${url}`;

    }))

  return response.send(instances);
}

export default allowCors(handler);
