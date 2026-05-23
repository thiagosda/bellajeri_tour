export default async function handler(req, res) {
  // CORS — permite apenas o próprio domínio
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const API_KEY = process.env.GOOGLE_PLACES_KEY || 'AIzaSyAYjdUoXKZ0lRJoe5rVSbGiyyiMp0b8zSo';
  const QUERY   = 'Bella Jeri Tour Jericoacoara';

  try {
    // Passo 1: busca o place_id pelo nome
    const findUrl =
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
      `?input=${encodeURIComponent(QUERY)}` +
      `&inputtype=textquery` +
      `&fields=place_id` +
      `&key=${API_KEY}`;

    const findResp = await fetch(findUrl);
    const findData = await findResp.json();

    if (findData.status !== 'OK' || !findData.candidates || !findData.candidates.length) {
      return res.status(200).json({ status: findData.status, reviews: [] });
    }

    const placeId = findData.candidates[0].place_id;

    // Passo 2: busca os detalhes com reviews
    const detailUrl =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${placeId}` +
      `&fields=name,rating,user_ratings_total,reviews,url` +
      `&language=pt-BR` +
      `&reviews_sort=most_relevant` +
      `&key=${API_KEY}`;

    const detailResp = await fetch(detailUrl);
    const detailData = await detailResp.json();

    if (detailData.status !== 'OK' || !detailData.result) {
      return res.status(200).json({ status: detailData.status, reviews: [] });
    }

    const reviews = (detailData.result.reviews || [])
      .filter(r => r.text && r.text.trim())
      .sort((a, b) => b.rating - a.rating || b.time - a.time);

    // Cache de 6 horas no Vercel Edge
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate');

    return res.status(200).json({
      status: 'OK',
      rating: detailData.result.rating,
      total: detailData.result.user_ratings_total,
      url: detailData.result.url,
      reviews
    });

  } catch (err) {
    console.error('[api/reviews] Erro:', err);
    return res.status(500).json({ status: 'ERROR', reviews: [] });
  }
}
