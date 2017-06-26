var webpage = require('webpage');

module.exports = function(data, done, worker) {
    var page = webpage.create();
    page.settings.resourceTimeout = 10000; //timeout
    page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
    page.viewportSize = {
      width: 1024,
      height: 768
    };

    page.onResourceError = function(resourceError) {
      if(resourceError.errorCode == 5){//Enable these for debugging
        //console.log("VERBOSE:Operation cancelled error (probably port closed): "+data);
      }
      else if (resourceError.errorCode == 3) {
        //console.log("Host not found: "+data);
      }
    };

    page.open(data);
    page.onLoadFinished = function(status) {
      if(status == "success"){
        var proto = data.split(/:\/\//)[0];
        var filename = data.split(/:\/\//)[1].replace(/[^A-Za-z0-9\.]/g,"-");
        //console.log(filename.replace(/\//g,"-"));
        //console.log(filename);
        var fname = "output/"+proto+"-"+filename+"-"+(new Date).getTime() + '.png';
        page.render(fname);
        done(null,{"url":data});
      }
      else{
        if(page.content.length > 40){ //40 == length of empty phantom page
        var fname = "output/fails/"+data.split(/:\/\//)[1]+"-"+(new Date).getTime() + '.png';
        page.render(fname);
        done(new Error("Screenshot partially failed : " + data));
      }else{
        done(new Error("Screenshot completely failed : " + data));
      }
      }
};

};
