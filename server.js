const http = require('http');
const fs = require('fs');
const xml = require('fast-xml-parser');

const port = 8000;

function WriteResultArray(result, parsDATA)
{
    if (parsDATA.indicators.banksincexp) {
        const indicators = Array.isArray(parsDATA.indicators.banksincexp)
          ? parsDATA.indicators.banksincexp
          : [parsDATA.indicators.banksincexp];
    
        indicators.forEach((indicator) => {
          if (indicator.txt === 'Доходи, усього' || indicator.txt === 'Витрати, усього') {
            result.data.indicators.push({
              txt: indicator.txt,
              value: parseFloat(indicator.value),
            });
          }
        });
      }
}

const requestListener = function (req, res) {
  const xmlData = fs.readFileSync('data.xml', 'utf-8');

  const options = {
    ignoreAttributes: false,
  };

  const parser = new xml.XMLParser();
  const parsedData = parser.parse(xmlData, options);

  const selectedData = {
    data: {
      indicators: [],
    },
  };

  WriteResultArray(selectedData, parsedData);

  const builder = new xml.XMLBuilder({ format: true });
  const xmlStr = builder.build(selectedData);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.writeHead(200);
  res.end(xmlStr);
};

const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});