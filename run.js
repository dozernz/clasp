var parseArgs = require('minimist')(process.argv.slice(2))

function parseNetmask(block){
  var ipblock = [];
  block.forEach(function(ip, long, index){
    ipblock.push("http://"+ip);
    ipblock.push("https://"+ip);
  });
  return ipblock
}


exports.getOpts = function(){
  opts = {};
  if(parseInt(parseArgs.t) >= 0){
    opts.workers = parseArgs.t;
  }else{
    opts.workers = 5;}
  //console.log(opts)
  return opts;
}

exports.getHosts = function(){
  if(Object.keys(parseArgs).length == 1 && parseArgs._.length == 0){
    console.log("Usage: clasp.js [-f FILE] [-t threads] HOSTNAME");
    return false;
  }

  if(parseArgs.h || parseArgs.help || (parseArgs.length == 1 && !parseArgs._ )){
    console.log("Usage: clasp.js [-f FILE] [-t threads] HOSTNAME");
    console.log("Example: clasp.js https://example.com");
    console.log("Example: clasp.js -f hosts.txt");
    return false;
  }

  if(parseArgs.f){
    //Read from file and return array of lines
    try{
      var hostsAr = [];
      filename = parseArgs.f;
      var array = require('fs').readFileSync(filename).toString().split("\n");
      array = array.filter(function(n){
        if(n!=""){
          if(n.match(/http[s]?\:\/\//)){
            hostsAr.push(n);
          }else{
              if(n.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/[0-9]{1,2}$/)){
                //Looks like a subnet
                try{
                  var Netmask = require('netmask').Netmask
                  var block = new Netmask(n);
                  var block_ar = parseNetmask(block);
                  block_ar.forEach(function (b){
                    hostsAr.push(b);
                  });
                }
                  catch(err){
                  //Not a ip range
                    console.log("Failed to parse netmask "+n);
                  }
                }

              else{
                hostsAr.push("http://"+n);
                hostsAr.push("https://"+n);
          }
          }
        }
      });
      return hostsAr;
    }
    catch(err){
      console.log("Failed to read file or something")
      return false;
    }
  }

  else if(parseArgs._.length > 0){
    var singlehost = parseArgs._[0];

    try{
      var Netmask = require('netmask').Netmask
      var block = new Netmask(singlehost);
      return parseNetmask(block);
    } catch(err){
    //Not a ip range
      console.log("Screenshotting single host: "+singlehost);
    }

    if(singlehost.indexOf("://") == -1){
      //This is a host without http or https
      var singleHostWithProtocol = [];
      singleHostWithProtocol.push("http://"+singlehost)
      singleHostWithProtocol.push("https://"+singlehost)
      return singleHostWithProtocol;
    }
    else{
      return [singlehost];
    }
  }
};
