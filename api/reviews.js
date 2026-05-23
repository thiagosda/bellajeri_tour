export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const API_KEY = process.env.GOOGLE_PLACES_KEY || 'AIzaSyAYjdUoXKZ0lRJoe5rVSbGiyyiMp0b8zSo';

  // Place ID exato da BellaJeri Tour — extraído de:
  // https://maps.app.goo.gl/P4reX7EVpGpVALyJA
  // hex: 0xa6814d67fc0690bf : 0x7f1937a6bf834f06
  const PLACE_ID  = 'ChIJv5AGfGfRhjsRBk-Dv6Y3GX8';
  const MAPS_URL  = 'https://maps.app.goo.gl/P4reX7EVpGpVALyJA';

  try {
    const detailUrl =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${PLACE_ID}` +
      `&fields=name,rating,user_ratings_total,reviews` +
      `&language=pt-BR` +
      `&reviews_sort=most_relevant` +
      `&key=${API_KEY}`;

    const detailResp = await fetch(detailUrl);
    const detailData = await detailResp.json();

    // Se o Place ID hardcoded falhar, tenta busca por nome como fallback
    if (detailData.status !== 'OK' || !detailData.result) {
      const findUrl =
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
        `?input=${encodeURIComponent('BellaJeri Tour Jericoacoara')}` +
        `&inputtype=textquery` +
        `&fields=place_id` +
        `&key=${API_KEY}`;

      const findResp = await fetch(findUrl);
      const findData = await findResp.json();

      if (findData.status !== 'OK' || !findData.candidates || !findData.candidates.length) {
        return res.status(200).json({ status: findData.status || detailData.status, reviews: [], url: MAPS_URL });
      }

      const fallbackId = findData.candidates[0].place_id;
      const fbDetailUrl =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${fallbackId}` +
        `&fields=name,rating,user_ratings_total,reviews` +
        `&language=pt-BR` +
        `&reviews_sort=most_relevant` +
        `&key=${API_KEY}`;

      const fbResp = await fetch(fbDetailUrl);
      const fbData = await fbResp.json();

      if (fbData.status !== 'OK' || !fbData.result) {
        return res.status(200).json({ status: fbData.status, reviews: [], url: MAPS_URL });
      }

      const reviews = (fbData.result.reviews || [])
        .filter(r => r.text && r.text.trim() && r.rating === 5)
        .sort((a, b) => b.time - a.time);

      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      return res.status(200).json({
        status: 'OK',
        rating: fbData.result.rating,
        total: fbData.result.user_ratings_total,
        url: MAPS_URL,
        reviews
      });
    }

    const reviews = (detailData.result.reviews || [])
      .filter(r => r.text && r.text.trim() && r.rating === 5)
      .sort((a, b) => b.time - a.time);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({
      status: 'OK',
      rating: detailData.result.rating,
      total: detailData.result.user_ratings_total,
      url: MAPS_URL,
      reviews
    });

  } catch (err) {
    console.error('[api/reviews] Erro:', err);
    return res.status(500).json({ status: 'ERROR', reviews: [], url: MAPS_URL });
  }
}
