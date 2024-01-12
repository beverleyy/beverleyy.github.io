/* For the CORS-Anywhere server, I'm just reusing the one I made for the MOE2018TRF005 study because too lazy to make a new one... */
// var cors_api = 'https://cors-anywhere.herokuapp.com';
var cors_api = 'https://moe2018trf005cors.onrender.com';
var spreadsheet = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS9lrQ1g5CiWV7fgUbIa5SFHFAB50fu4Z8cZOsKITFb5pkFSOQTJHSSvU-4Aj3i6xbtS49f78NXNA36/pub?gid=0&single=true&output=csv';
var spreadsheet2 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZWu5VQRpDExhcugQvKzTAne3V4eZnuBelxnHlC_Ziz--qfnAiKWEPA3DX4z1p9dNlFqKgGn079-ii/pub?gid=0&single=true&output=csv';

var placeHolder = [];
var presentations = [], 
    articles = [];

var cors_api_host = cors_api.replace('https://','');
var cors_api_url = cors_api + '/';
var slice = [].slice;
var origin = window.location.protocol + '//' + window.location.host;
var open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
    var args = slice.call(arguments);
    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
    if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
        targetOrigin[1] !== cors_api_host) {
        args[1] = cors_api_url + args[1];
    }
    return open.apply(this, args);
};

var x = new XMLHttpRequest();
x.open('GET', cors_api+'/'+spreadsheet);
x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
x.onload = function() {
	Papa.parse(x.responseText,{
 		//download: true, 
 		header: true,
 		step: function(row) {
 			var thisRow = row.data;
 			var thisMonth = parseInt(thisRow.Month),
				theMonth = thisMonth<10 ? "0"+thisRow.Month : thisRow.Month;
			var newLi = document.createElement("li");
			newLi.setAttribute("data-year",thisRow.Year);
			newLi.setAttribute("data-month",theMonth);
			newLi.innerHTML = thisRow.Text;
			placeHolder.push(newLi);
 		},
 		complete: function (results) {
			var container = document.querySelectorAll("#latest .terminal")[0];
			container.innerHTML = "";
			placeHolder = placeHolder.reverse()
			placeHolder.forEach(function(e,i,a) {
				var y = e.getAttribute("data-year");
				if(!container.querySelectorAll('ul[data-year="'+y+'"]')[0]){
					var newText = document.createElement("p");
					newText.classList = "cmd";
					newText.innerHTML = "<strong>news@beverleyy:~$</strong> ls "+y;
					container.appendChild(newText)
					var newList = document.createElement("ul");
					newList.setAttribute("data-year",y);
					container.appendChild(newList);
				}
				container.querySelectorAll('ul[data-year="'+y+'"]')[0].appendChild(e);
			});
 		}
 	});
};
x.send();

var x2 = new XMLHttpRequest();
x2.open('GET', cors_api+'/'+spreadsheet2);
x2.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
x2.onload = function() {
	Papa.parse(x2.responseText,{
 		//download: true, 
 		header: true,
 		step: function(row) {
 			var thisRow = row.data;
            var thisType = thisRow.Type;
            var newLi = document.createElement("li");
            var contents = thisRow.Citation;
            contents = contents.replaceAll('Yeo K.W.B.','<em>Yeo K.W.B.</em>').replaceAll('K.W.B. Yeo','<em>K.W.B. Yeo</em>')
            if (thisRow.DOI){
                contents += ' ' //add empty space
                contents += 'doi: <a href="https://doi.org/'+thisRow.DOI+'">'+thisRow.DOI+'</a>'
            }
            newLi.innerHTML = contents;
            newLi.classList.add("ti-caret-right")
            if (thisType.toLowerCase() === 'presentation') presentations.push(newLi)
            else if (thisType.toLowerCase() === 'article') articles.push(newLi)
 		},
 		complete: function (results) {
			var container = document.querySelectorAll("#pubslist .terminal")[0];
			container.innerHTML = "";
            articles = articles.reverse()
            presentations = presentations.reverse()
            if(articles.length){
                var newText = document.createElement("p");
                newText.classList.add("cmd");
                newText.innerHTML = "<strong>publications@beverleyy:~$</strong> ls journal_papers";
                container.appendChild(newText)
                var newList = document.createElement("ul")
                articles.forEach((item) => {
                    newList.appendChild(item)
                })
                container.appendChild(newList)
            }
            if(presentations.length){
                var newText = document.createElement("p");
                newText.classList.add("cmd");
                newText.innerHTML = "<strong>publications@beverleyy:~$</strong> ls conference_presentations";
                container.appendChild(newText)
                var newList = document.createElement("ul")
                presentations.forEach((item) => {
                    newList.appendChild(item)
                })
                container.appendChild(newList)
            }
 		}
 	});
};
x2.send();
