const fs = require('fs');
const psi = require('psi');
const csvSync = require('csv-parse/lib/sync');
const asciify = require('asciify');
const inquirer = require('inquirer');
const questions = require('./questions.json');

asciify('PSICLE', {font: 'small'}, (err, msg) => {
  console.log(msg)
  inquirer.prompt(questions).then(answers => executePsi(answers));
});

/**
 * Execute Page Speed Insights wirh reporting.
 * @param {Object} options  https://github.com/addyosmani/psi#options
 */
function executePsi(options) {
  const file = './data/input.csv';
  let data = fs.readFileSync(file);
  let res = csvSync(data);
  res.shift();  // Delete CSV 1st line
  const urls = res.map((x) => x[0]);
  const psis = urls.map((url) => psi(url, options));
  Promise.all(psis).then(function(values) {
    const results = [];
    for (const value of values) {
      const ruleGroups = value.ruleGroups;
      const pageStats = value.pageStats;
      const ruleResults = value.formattedResults.ruleResults;
      const result = {
        'URL': value.id,
        'Strategy': options.strategy,
        'Speed': ruleGroups.SPEED.score,
        'Usability': ruleGroups.USABILITY ? ruleGroups.USABILITY.score: '',
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
    fs.unlinkSync('./data/output.csv');
    fs.writeFileSync('./data/output.csv', csv);
    console.log('output.csv is successfully created.');
  });
}
