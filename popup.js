(function(){

  var speechUtteranceChunker = function (utt, settings, callback) {
    settings = settings || {};
    var newUtt;
    var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
    
    if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
        newUtt = utt;
        newUtt.text = txt;
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
            }
            if (callback !== undefined) {
                callback();
            }
        });
    }
    else {
        var chunkLength = (settings && settings.chunkLength) || 160;
        var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
        var chunkArr = txt.match(pattRegex);
        if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
            //call once all text has been spoken...
                    console.log('point1.5');

            if (callback !== undefined) {
                callback();
            }
            return;
        }
        console.log('point2');
        var chunk = chunkArr[0];
        console.log('point3');
        newUtt = new SpeechSynthesisUtterance(chunk);
        newUtt.lang = 'en-US';
        var x;
        for (x in utt) {
            if (utt.hasOwnProperty(x) && x !== 'text') {
                newUtt[x] = utt[x];
            }
        }
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
                return;
            }
            settings.offset = settings.offset || 0;
            settings.offset += chunk.length - 1;
            speechUtteranceChunker(utt, settings, callback);
        });
    }

    if (settings.modifier) {
        settings.modifier(newUtt);
    }
    console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
    //placing the speak invocation inside a callback fixes ordering and onend issues.
    setTimeout(function () {
        speechSynthesis.speak(newUtt);
    }, 0);
};


function helper(){
   
      reddit.search(window.location.href).t('all').limit(10).sort("top").fetch(function(res) {
    // res contains JSON parsed response from Reddit
    console.log(res);
        if(res != "{}"){
            console.log(res);
            var id;
            var subreddit;
            if(res.length>1){
                
                id = res[0].data.children[0].data.id;
                subreddit = res[0].data.children[0].data.subreddit;
            } else{
                var index = 0;
                var currNum = 0;
                for(var i =0;i<res.data.children.length;i++){
                    if(res.data.children[i].data.num_comments>currNum){
                        index = i;
                        currNum = res.data.children[i].data.num_comments;
                    }
                }
                id = res.data.children[index].data.id;
                subreddit = res.data.children[index].data.subreddit;
            }
            console.log(id+subreddit);

            reddit.comments(id, subreddit).limit(100).sort("top").fetch(function(res2) {
            console.log(res2);
            for(var i = 0;i<res2[1].data.children.length;i++){
                comment(res2[1].data.children[i]);

            }
            if(allRedditComments == ""){
        console.log(allRedditComments);
                allRedditComments = "No comments found for this page. Better luck next time."
            }
            var utterance = new SpeechSynthesisUtterance(allRedditComments);

          //modify it as you normally would
          speechUtteranceChunker(utterance, {
            chunkLength: 120
            }, function () {
                //some code to execute when done
                console.log('done');
            });

            
          });
        } else {
            if(allRedditComments == ""){
        console.log(allRedditComments);
                allRedditComments = "No comments found for this page. Better luck next time."
            }
            var utterance = new SpeechSynthesisUtterance(allRedditComments);

          //modify it as you normally would
          speechUtteranceChunker(utterance, {
            chunkLength: 120
            }, function () {
                //some code to execute when done
                console.log('done');
            });
        }
        
    
      });
    

    
/*
        */
         
}


	  

//reddit.comments("3rp57i", "videos").limit(100).sort("hot").fetch(function(res) {
 //   console.log(res);
  //});
function comment(comm){
	
	if(comm.data.body!=undefined){
		console.log(comm.data.body);
		allRedditComments = allRedditComments+" "+comm.data.body;	
	}
	console.log(comm);
	if(comm.data.replies != undefined && comm.data.replies.data!=undefined){
		for(var i = 0;i<comm.data.replies.data.children.length;i++){
    	comment(comm.data.replies.data.children[i]);

    }
	}
	
}


function init(){
 /*   var js = document.createElement("script");

js.type = "text/javascript";
js.onreadystatechange= function () {
      if (this.readyState == 'complete') helper();
   }
   js.onload= helper;

js.src = '//cdn.jsdelivr.net/reddit.js/0.1.3/reddit.min.js';

document.body.appendChild(js);
*/
allRedditComments = "";
helper();
}
 var allRedditComments = "";
console.log('start');
init();

//window.onload = init;

})();