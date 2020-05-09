/**

  FAST HTTP
  Author: Matthew Zinke <m.zinke@f5.com>

  FAST HTTP will quickly stand up an HTTP service for rendering
  volume mounted FAST Templates.

  Each template in the volume will be mapped to a URL endpoint
  using the title in the template. 

*/

const http = require('http');

const fs = require('fs');
const util = require('util');
const yaml = require('js-yaml');

const fast = require('@f5devcentral/f5-fast-core');

const app = require('polka');


const basedir = process.env.F5_FAST_TEMPLATE_ROOT || './templates';
const templates = {};

console.log(basedir);

const ls = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

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

    app()
      .get('/:path', (req, res) => {
        const press = templates[req.params.path.toLowerCase()];
        if(press) {
          res.end(JSON.stringify(press._parametersSchema));
        } else {
          res.end('404: template not found');
        }
      })
      .post('/:path', (req, res) => {
        const press = templates[req.params.path.toLowerCase()];
        if(press) {
          const buffer = [];
          req.on('data', (data) => {
            buffer.push(data.toString('utf8'));
          });
          req.on('end', () => {
            const params = JSON.parse(buffer.join(''));
            console.log(params);
            res.end(press.render(params));
          });
          req.on('error', () => {
            res.end('500: template error');
          });
        } else {
          res.end('404: template not found');
        }
      })
      .listen(3000);
  });
