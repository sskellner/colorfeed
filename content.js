MutationObserver = window.WebKitMutationObserver
observer = new MutationObserver(function(mutations, observer) {update()});

observer.observe(document.getElementsByClassName("_1qkq _1qkx")[0], {
            subtree: true,
            childList: true,
            attributes: false
        }); 

update()

chrome.storage.sync.clear()

function insert_alpha(string, likes) {
	alpha = 0.45
	if (likes == -1) {
		alpha = 0.1
	}
	if(likes > 10){
		alpha = .6
	}
	if(likes > 20) {
		alpha = .8
	}
	if(likes > 50) {
		alpha = .9
	}
	if(likes > 100) {
		alpha = 1.
	}

	ind = string.indexOf("alpha")
	string = string.substring(0, ind) + alpha +")"
	return string	
}


function process_likes(str) {
	end_ind = str.indexOf("</span>")
	if (end_ind == -1) {
		return -1;
	}

	start_ind = str.indexOf(">", 7)
	unparsed = str.substring(start_ind+1, end_ind)
	curr = 0
	nancount = 0
	seen_dec = 0
	for(i = 0; i < unparsed.length; i++) {
		if (curr != 0 && unparsed[i] == '.') {
			seen_dec = 1
		}
		n = Number(unparsed[i])
		if(curr != 0 && unparsed[i].toLowerCase()=='k') {
			if (seen_dec == 0) {
				curr = curr*10
			}
			curr = curr*100
		}

		if(nancount > 30) {
			return 0
		}

		if(isNaN(n)) {
			nancount = nancount+1
			continue
		}
		curr = curr*10
		curr += n
		nancount = 0
	}
	return curr
}

function pick_color(html) {
	shadow_color = "rgba(0, 0, 255, alpha)"
	topics = ["cons", "liberal", "healthcare", "test", "climate"]
	color = {"cons": ["donald trump", "trump", "mike pence", "fox news",
					   "nationalreview.com", "breitbart", "melania", "liberal media",
					   "obummer", "bannon", "ivanka"], 
         "cons_color": "rgba(0, 0, 255, alpha)", // blue
		 "liberal": ["sanders", "progressive", "liberals", "resist", "democrat", "lago",
		 			 "privacy", "abortion", "union", "livable wage", "minimum wage", "aclu"],
		 "liberal_color": "rgba(255, 165, 0, alpha)", //orange
		 "healthcare": ["healthcare", "obamacare", "affordable care act", "contraceptives",
		 				"clinic", "abortion", "planned parenthood", "pills"],
		 "healthcare_color": "rgba(0, 255, 0, alpha)", //green
		 "test": ["sublet", "apartment", "rent", "housing", "bedroom"],
		 "test_color": "rgba(255, 0, 0, alpha)", //red
		 "climate": ["global warming", "climate", "climate change", "ice caps", "weather"],
		 "climate_color": "rgba(255, 0, 255, alpha)",//teal
		}

	max_score = 0
	max_ind = -1

	txt = html.innerText.toLowerCase()
	like_ind = html.innerHTML.indexOf("_4arz")
	if(like_ind==-1){
		likes = 0
	}
	else {
		str = html.innerHTML.substring(like_ind, like_ind+400)
		likes = process_likes(str)

	}

	for(i=0;i<topics.length; i++) {
		// For each topic
		topic = topics[i]
		kwords = color[topic]
		score = 0
		for(j=0;j<kwords.length;j++) {
			// for each keyword
			strind = txt.indexOf(kwords[j])
			if(strind == -1) {
				strind = false
			}
			else{
				strind = true
			}
			score = score + strind
		}
		score = score / kwords.length
		if(score > max_score){
			max_ind = i
			max_score = score
		}
	}
	if(max_ind == -1) {
		return -1
	}
	picked_color = topics[max_ind] + "_color"
	return insert_alpha(color[picked_color], -1)+"; box-shadow: 10px 0px 5px " + insert_alpha(shadow_color, likes)
}

function add_storage(element) {

	auth = "EAACEdEose0cBAD50kHUDoFebBTTZBXC7FMVXujA4xPrUyyRwnQPv5iQozffwvuSuHzNv6ZAObF88Cd4WZCXMB3RPVwLT9GM0FyYuEEFjO9ev454mfJjf59rIbiyZAL6IpMBbPID3cAMPnZAzmIZCfgUoyntZB1BS8EN7rF6VzCppqLQfY2u4vMc"
	categories = "Editor"+ "TV Network"+ "TV Show"+ "Public Figure"+ "Journalist"+ "News Personality"+
						"Lawyer"+ "Business Person"+ "Entertainer"+ "Politician"+ "Government Official"+ "Media/News Company"+
						"Industrials"+ "Education"+ "Political Organization"+ "Community/Government"+ "Political Party" + "News/Media Website"
	n = element.getElementsByTagName("a")
	for(i = 0; i < n.length; i++) {
		link = n[i].getAttribute('href')
		if(n[i].getAttribute("data-hovercard-obj-id") != null) {
			//page
			id = n[i].getAttribute("data-hovercard-obj-id")
			// page_id: Flag whether we've seen it before
			// page_id_valid: Whether it's a page we want to track
			// page_id_count: How many times encountered before
			chrome.storage.sync.get([String(id), String(id)+"_valid", String(id)+"_count"], function (results) {
    			console.log("first")
    			console.log(results)
    			if(String(id) in results) {
    				// Seen before
    				if(results[String(id)+"_valid"]) {
    					// we care about it
    					curr = results[String(id)+"_count"]
						curr += 1
						results[String(id) + "_count"] = curr
						chrome.storage.sync.set(results)
    				}
    				return
    			}
    			else {
    				// Haven't seen before
    				// Never seen page before
					xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function() {
					  if (this.readyState == 4 && this.status == 200) {
					  	res = this.response
						js = JSON.parse(res)
						cat = js['category']
						ked = categories.indexOf(cat)
						json = {}
						if(ked == -1) {
							// not interested, skip and mark
							json[String(id)+"_valid"] = false
							json[String(id)] = true
							chrome.storage.sync.set(json)
							return
						}
						else{
							json[String(id)] = true
							json[String(id)+"_valid"] = true
							json[String(id)+"_count"] = 1
							chrome.storage.sync.set(json)
						}
					  }
					};
					xhttp.open("GET", "https://graph.facebook.com/"+id+"?fields=category,about,description&access_token="+auth, true);
					xhttp.send();
    			}
			})
		}
	}
	chrome.storage.sync.get(null, function(res) {
		console.log(res)
	})
}

function update() {
	run = document.getElementsByClassName("_1dwg _1w_m")

	for(count = 0; count < run.length; count++) {
		if(run[count].getAttribute("cf_seen") == null){
			run[count].setAttribute("cf_seen", true)
		}
		else{
			continue
		}
		t = add_storage(run[count])
		// s = pick_color(run[count])
		// if (s == -1) {
		// 	// No color
		// 	continue
		// }
		// run[count].setAttribute("style",
		// 	"border-right:20px solid " + s)
	}
	return
}
