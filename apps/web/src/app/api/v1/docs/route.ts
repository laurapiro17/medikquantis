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
    .quickstart {
      background: #0b0f14;
      color: #e6f7ff;
      padding: 32px;
      border-bottom: 1px solid #00f0ff33;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    .quickstart h2 {
      margin: 0 0 16px;
      font-size: 14px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #00f0ff;
    }
    .qs-tabs { display: flex; gap: 4px; margin-bottom: 12px; }
    .qs-tab {
      padding: 6px 14px;
      font-size: 12px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #9fbac8;
      background: transparent;
      border: 1px solid #00f0ff22;
      cursor: pointer;
      border-radius: 4px;
    }
    .qs-tab.active { color: #00f0ff; border-color: #00f0ff66; background: #00f0ff0d; }
    .qs-pane {
      display: none;
      background: #060a0e;
      border: 1px solid #00f0ff22;
      border-radius: 6px;
      padding: 16px;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 13px;
      line-height: 1.55;
      white-space: pre;
      overflow-x: auto;
      color: #d6e9f3;
    }
    .qs-pane.active { display: block; }
    .qs-pane .c { color: #6c8294; }
    .qs-pane .k { color: #00f0ff; }
    .qs-pane .s { color: #b6e8a0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>MedikQuantis API · v1</h1>
    <p>
      Open clinical calculators · MIT licensed ·
      <a href="https://doi.org/10.5281/zenodo.20562617">DOI 10.5281/zenodo.20562617</a> ·
      <a href="https://github.com/laurapiro17/medikquantis">github.com/laurapiro17/medikquantis</a>
    </p>
  </div>
  <div class="quickstart">
    <h2>Quick start</h2>
    <div class="qs-tabs" role="tablist">
      <button class="qs-tab active" data-pane="curl" role="tab">curl</button>
      <button class="qs-tab" data-pane="js" role="tab">JavaScript</button>
      <button class="qs-tab" data-pane="py" role="tab">Python</button>
    </div>

    <pre class="qs-pane active" id="qs-curl"><span class="c"># Single calculation, response in Spanish</span>
curl -X POST <span class="s">"https://medikquantis.vercel.app/api/v1/cha2ds2vasc?lang=es"</span> \
  -H <span class="s">"Content-Type: application/json"</span> \
  -d <span class="s">'{"age":72,"sex":"female","chf":false,"hypertension":true,"diabetes":false,"strokeOrTia":true,"vascularDisease":false}'</span>

<span class="c"># Two calcs in one request via /batch</span>
curl -X POST <span class="s">"https://medikquantis.vercel.app/api/v1/batch"</span> \
  -H <span class="s">"Content-Type: application/json"</span> \
  -d <span class="s">'{"calcs":[{"id":"cha2ds2vasc","inputs":{"age":72,"sex":"female","chf":false,"hypertension":true,"diabetes":false,"strokeOrTia":true,"vascularDisease":false}},{"id":"hasbled","inputs":{"age":72,"uncontrolledHypertension":false,"abnormalRenalFunction":false,"abnormalLiverFunction":false,"strokeHistory":true,"bleedingHistoryOrPredisposition":false,"labileInr":false,"drugsPredisposingToBleeding":false,"alcoholExcess":false}}]}'</span></pre>

    <pre class="qs-pane" id="qs-js"><span class="k">const</span> res = <span class="k">await</span> fetch(
  <span class="s">"https://medikquantis.vercel.app/api/v1/cha2ds2vasc?lang=ca"</span>,
  {
    method: <span class="s">"POST"</span>,
    headers: { <span class="s">"Content-Type"</span>: <span class="s">"application/json"</span> },
    body: JSON.stringify({
      age: 72, sex: <span class="s">"female"</span>,
      chf: <span class="k">false</span>, hypertension: <span class="k">true</span>, diabetes: <span class="k">false</span>,
      strokeOrTia: <span class="k">true</span>, vascularDisease: <span class="k">false</span>,
    }),
  },
);
<span class="k">const</span> data = <span class="k">await</span> res.json();
console.log(data.score, data.tier, data.recommendation);</pre>

    <pre class="qs-pane" id="qs-py"><span class="k">import</span> httpx

resp = httpx.post(
    <span class="s">"https://medikquantis.vercel.app/api/v1/cha2ds2vasc"</span>,
    params={<span class="s">"lang"</span>: <span class="s">"es"</span>},
    json={
        <span class="s">"age"</span>: 72, <span class="s">"sex"</span>: <span class="s">"female"</span>,
        <span class="s">"chf"</span>: <span class="k">False</span>, <span class="s">"hypertension"</span>: <span class="k">True</span>, <span class="s">"diabetes"</span>: <span class="k">False</span>,
        <span class="s">"strokeOrTia"</span>: <span class="k">True</span>, <span class="s">"vascularDisease"</span>: <span class="k">False</span>,
    },
    timeout=10,
)
data = resp.json()
<span class="k">print</span>(data[<span class="s">"score"</span>], data[<span class="s">"tier"</span>], data[<span class="s">"recommendation"</span>])</pre>
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
      // Quick start tabs
      document.querySelectorAll(".qs-tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
          var name = tab.getAttribute("data-pane");
          document.querySelectorAll(".qs-tab").forEach(function (t) {
            t.classList.toggle("active", t === tab);
          });
          document.querySelectorAll(".qs-pane").forEach(function (p) {
            p.classList.toggle("active", p.id === "qs-" + name);
          });
        });
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
