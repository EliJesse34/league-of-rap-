/**
 * Cloudflare Worker redirect: apex domain → www
 * Deploy with: wrangler deploy
 */

export default {
  fetch(request: Request) {
    const url = new URL(request.url);

    // Redirect apex (leagueofrap.com) to www
    if (url.hostname === "leagueofrap.com") {
      return Response.redirect(
        `https://www.leagueofrap.com${url.pathname}${url.search}`,
        301
      );
    }

    // All other requests pass through
    return fetch(request);
  },
} satisfies ExportedHandler;
