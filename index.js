/**

  FAST HTTP
  Author: Matthew Zinke <m.zinke@f5.com>

  FAST HTTP will quickly stand up an HTTP service for rendering
  volume mounted FAST Templates.

  Each template in the volume will be mapped to a URL endpoint
  using the title in the template.

*/

const fs = require('fs');
const http = require('http');

const util = require('util');
const ls = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const yaml = require('js-yaml');
const app = require('polka');

const fast = require('@f5devcentral/f5-fast-core');

const basedir = process.env.F5_FAST_TEMPLATE_ROOT || './templates';
const templates = {};

console.log(`basedir ${basedir}`);

const simpleTestPoc = (input) => input*2;

const httpGetTemplate = (req, res) => {
  const press = templates[req.params.path.toLowerCase()];
  if(press) {
    res.end(JSON.stringify(press._parametersSchema));
  } else {
    res.end('404: template not found');
  }
};

const httpPostTemplate = (req, res) => {
  const press = templates[req.params.path.toLowerCase()];
  if(press) {
    const buffer = [];
    req.on('data', (data) => {
      buffer.push(data.toString('utf8'));
    });
    req.on('end', () => {
      const params = JSON.parse(buffer.join(''));
      //console.log(params);
      res.end(press.render(params));
    });
    req.on('error', () => {
      res.end('500: template error');
    });
  } else {
    res.end('404: template not found');
  }
};

const server = app();
server.get('/:path', httpGetTemplate);
server.post('/:path', httpPostTemplate);

//main promise chain listens on port 3000
ls(basedir)
  .then((list) => {
    return Promise.all(list.map(fname => readFile(basedir + '/' + fname)));
  })
  .then((results) => {
    const files = results.map(x => x.toString('utf8'));
    return Promise.all(files.map(yaml => fast.Template.loadYaml(yaml)));
  })
  .then((results) => {
    results.forEach((template) => {
      templates[template.title.toLowerCase()] = template;
      console.log(template.title, 'loaded');
    });
    // template set loaded in cache at this point

    //server start
    server.listen(3000);
  });


module.exports = {
  httpGetTemplate,
  httpPostTemplate,
  simpleTestPoc
}
