export const runtime = "edge";

const HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MedikQuantis API — Reference</title>
  <link rel="icon" href="data:," />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css"
    integrity="sha384-wxLW6kwyHktdDGr6Pv1zgm/VGJh99lfUbzSn6HNHBENZlCN7W602k9VkGdxuFvPn"
    crossorigin="anonymous"
  />
  <style>
    body { margin: 0; background: #0b0f14; }
    .topbar { display: none; }
    #swagger-ui { background: #fff; min-height: 100vh; }
    .header {
      background: #0b0f14;
      color: #e6f7ff;
      padding: 24px 32px;
      font-family: ui-sans-serif, system-ui, sans-serif;
      border-bottom: 1px solid #00f0ff33;
    }
    .header h1 { margin: 0 0 6px; font-size: 22px; letter-spacing: 0.02em; }
    .header p { margin: 0; color: #9fbac8; font-size: 14px; }
    .header a { color: #00f0ff; text-decoration: none; }
    .header a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <h1>MedikQuantis API · v1</h1>
    <p>
      Open clinical calculators · MIT licensed ·
      <a href="https://doi.org/10.5281/zenodo.20562618">DOI 10.5281/zenodo.20562618</a> ·
      <a href="https://github.com/laurapiro17/medikquantis">github.com/laurapiro17/medikquantis</a>
    </p>
  </div>
  <div id="swagger-ui"></div>
  <script
    src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"
    integrity="sha384-wmyclcVGX/WhUkdkATwhaK1X1JtiNrr2EoYJ+diV3vj4v6OC5yCeSu+yW13SYJep"
    crossorigin="anonymous"
  ></script>
  <script>
    window.addEventListener("load", function () {
      window.ui = SwaggerUIBundle({
        url: "/api/v1/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        layout: "BaseLayout",
        defaultModelsExpandDepth: 0,
        docExpansion: "list",
        tryItOutEnabled: true,
      });
    });
  </script>
</body>
</html>`;

export function GET(): Response {
  return new Response(HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
