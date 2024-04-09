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


  const data = fetch(`${api}/streams/${id}`)
    .then(res => res.json())
    .then(json => ({
      'title': json.title,
      'uploader': json.uploader,
      'uploaderUrl': json.uploaderUrl,
      'duration': json.duration,
      'thumbnailUrl': `https://i3.ytimg.com/vi_webp/${id}/mqdefault.webp`
    }))

  return response.send(data);
}

export default allowCors(handler);
