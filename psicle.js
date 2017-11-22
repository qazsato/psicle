const fs = require('fs');
const psi = require('psi');
const csvSync = require('csv-parse/lib/sync');

const file = './data/input.csv';
let data = fs.readFileSync(file);
let res = csvSync(data);
res.shift();  // CSV一行目削除
const urls = res.map((x) => x[0]);
const psis = urls.map((url) => psi(url, {strategy: 'mobile', locale: 'ja_JP'}));

// TODO strategyを引数で渡せるようにする
Promise.all(psis).then(function(values) {
  const results = [];
  for (const value of values) {
    const ruleGroups = value.ruleGroups;
    const pageStats = value.pageStats;
    const ruleResults = value.formattedResults.ruleResults;
    const result = {
      'URL': value.id,
      'Strategy': 'mobile',
      'Speed': ruleGroups.SPEED.score,
      'Usability': ruleGroups.USABILITY.score,
      'CSS size': pageStats.cssResponseBytes,
      'HTML size': pageStats.htmlResponseBytes,
      'Image size': pageStats.imageResponseBytes,
      'JavaScript size': pageStats.javascriptResponseBytes,
      'CSS resources': pageStats.numberCssResources,
      'Hosts': pageStats.numberHosts,
      'JS resources': pageStats.numberJsResources,
      'Resources': pageStats.numberResources,
      'Static resources': pageStats.numberStaticResources,
      'Total size of request bytes sent': pageStats.totalRequestBytes,
      'Leverage browser caching': ruleResults.LeverageBrowserCaching.ruleImpact,
      'Main resource server response time': ruleResults.MainResourceServerResponseTime.ruleImpact,
      'Minimize render blocking resources': ruleResults.MinimizeRenderBlockingResources.ruleImpact
    };
    results.push(result);
  }
  // JSON to CSV
  const header = Object.keys(results[0]).join(',') + "\n";
  const body = results.map((d) => Object.keys(d).map((key) => d[key]).join(',')).join("\n");
  const csv = header + body;
  fs.writeFile('./data/output.csv', csv);
});
