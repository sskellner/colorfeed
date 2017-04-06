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

function pick_color(html) {
	topics = ["cons", "liberal", "healthcare", "test", "climate"]
	color = {"cons": ["donald trump", "trump", "mike pence", "fox news",
					   "nationalreview.com", "breitbart", "melania", "liberal media",
					   "obummer", "bannon", "ivanka"], 
         "cons_color": "rgba(0, 0, 255, 0.1)", // blue
		 "liberal": ["sanders", "progressive", "liberals", "resist", "democrat", "lago",
		 			 "privacy", "abortion", "union", "livable wage", "minimum wage", "aclu"],
		 "liberal_color": "rgba(255, 165, 0, 0.1)", //orange
		 "healthcare": ["healthcare", "obamacare", "affordable care act", "contraceptives",
		 				"clinic", "abortion", "planned parenthood", "pills"],
		 "healthcare_color": "rgba(0, 255, 0, 0.1)", //green
		 "test": ["sublet", "apartment", "rent", "housing", "bedroom"],
		 "test_color": "rgba(255, 0, 0, 0.1)", //red
		 "climate": ["global warming", "climate", "climate change", "ice caps", "weather"],
		 "climate_color": "rgba(255, 0, 255, 0.1)",//teal
		}

	max_score = 0
	max_ind = -1

	txt = html.innerText.toLowerCase()

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
	return color[picked_color]
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
			"border-width:20px;border-style:solid;border-color:" + s)
	}
	return
}
