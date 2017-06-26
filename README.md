# clasp.js
**CL**i **A**ctivated **S**creenshots via **P**hantomJS

*A multiworker PhantomJS webpage screenshot CLI tool*

##Philosophy
Simplicity is the core philosophical principle of clasp.js. It has limited dependencies and cli switches, and is intended to be immiediately operable without reading tomes of documentation. It is also written to be as fast as possible, without needless overcomplication and still retaining reasonable functionality.

###Installation
Clone the repository, then ```cd clasp && npm install```

Tested on Debian 8.
###Usage
Usage: ```clasp.js [-f FILE] [-t threads] HOSTNAME```

Single host:```clasp.js http://example.com```

Multiple hosts:```clasp.js -f hosts.txt```

clasp understands hosts in a file in the following formats:
* http[s]://example.com
* http[s]://example.com:8443
* example.com:8080
* example.com
* 192.168.1.1
* 192.168.1.1/24
* www.example.com/path/page.html

###Operation details
clasp uses phantomjs and phantomjs-pool, which creates a pool of phantomjs workers. These are spun up then fed URLs from the input. Screenshots are written into an ```output``` folder in the current directory. Page loads that are deemed to have failed (but still have some data in the DOM) are also attempted to be rendered and written into an output subdirectory ```fails```. Pages may appear to fail when scripts on them fail to load for various reasons, however the render will usually still look fine.

####TODO
* log output to json containing host,ports,file location
* switch backend from phantom to chrome headless
