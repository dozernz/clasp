#!/usr/bin/node

var run = require('./run.js')
var hostsAr = run.getHosts()
if (!hostsAr){
  return;
}

var Pool = require('phantomjs-pool').Pool;
var colors = require('colors');


function jobCallback(job, worker, index) {
    urlz = hostsAr;
    if (index < urlz.length) {
        url = urlz[index];
        //console.log("URL = "+url);
        job(url, function afterJobCallback(error,data){

          if(error){
            if(error.message.indexOf("Screenshot partially failed") != -1){
              console.log(("ERR: "+error.message).yellow);
            }else{
            console.log(("ERR: "+error.message).red);}
          }
          else{
            console.log("Screenshot taken: "+(data.url).green)
          }
        });
    } else { // no more jobs
        job(null);
    }
}
var opts = run.getOpts();

var pool = new Pool({
      numWorkers : opts.workers,
      spawnWorkerDelay: 200,
      //phantomjsOptions: ["--ignore-ssl-errors=true","--debug=true"], //DEBUG mode
      phantomjsOptions: ["--ignore-ssl-errors=true"],
      jobCallback : jobCallback,
      //verbose: true, //Another debug option
      workerFile : __dirname + '/worker.js' // location of the worker file (as an absolute path)
  });
  pool.start();
