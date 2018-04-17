// Requires part.
var request = require('request');
var Tocken = require('./secrets');
var fs = require('fs');

// Define the program argumans.
var input = process.argv.slice(2);
var repoOwner = input[0];
var repoName = input[1];
//===============================================
function getRepoContributors(repoOwner, repoName, cb) {		// Connect to the Repo with identification by calling the tocken.
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': Tocken.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
   var repos = JSON.parse(body);
   repos.forEach(function(repos) {
 
     if(!fs.existsSync("avatars")){
     	fs.mkdirSync("avatars");
     }
     downloadImageByURL(repos.avatar_url, "avatars/" + repos.login + ".jpg");
   });
   cb(err, repos);
  });
}


function downloadImageByURL(url, filePath) {	//Downloading image by having URL and File path.

request.get(url)   
       .on('error', function (err) {                                   
         throw err; 
       })
       .on('response', function (response) {                           
         console.log('Downloading image...');
         console.log('Response Status Code: ', response.statusCode, "Header content = " ,response.headers['content-type']);
		 
       })
       .on('end', function() {
      
      	 console.log('Download complete.');
	   })
       .pipe(fs.createWriteStream(filePath)); 
}
//======================================================================================

if (input.length < 2) {		//Check the input parameters.
	console.log("\nPlease enter the correct format of parameters \n\nnode download_avatars <repoOwner> <repoName> \n");
}else{
  	getRepoContributors(repoOwner, repoName, function(err, result) {
  	console.log("Errors:", err);
  	console.log("Result:", result);
  });
}