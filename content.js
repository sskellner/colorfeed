MutationObserver = window.WebKitMutationObserver
observer = new MutationObserver(function(mutations, observer) {update()});

if(document.getElementById("contentArea") == null) {
	// no content area yet

}

observer.observe(document.getElementById("contentArea"), {
            subtree: true,
            childList: true,
            attributes: false
        }); 

update()

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

function update() {
	run = document.getElementsByClassName("_4-u2 mbm _4mrt")

	for(count = 0; count < run.length; count++) {
		if(run[count].getAttribute("cf_seen") == null){
			run[count].setAttribute("cf_seen", true)
		}
		else{
			continue
		}
		s = pick_color(run[count])
		if (s == -1) {
			// No color
			continue
		}
		run[count].setAttribute("style",
			"border-right:20px solid " + s)
	}
	return
}
