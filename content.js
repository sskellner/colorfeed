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
	topics = ["trump", "liberal", "healthcare", "test"]
	color = {"trump": ["donald trump", "trump", "mike pence", "fox news", "nationalreview.com"], 
         "trump_color": "rgba(0, 0, 255, 0.1)", // blue
		 "liberal": ["sanders", "progressive", "liberals"],
		 "liberal_color": "rgba(255, 165, 0, 0.1)", //orange
		 "healthcare": ["healthcare", "obamacare", "affordable care act",],
		 "healthcare_color": "rgba(0, 255, 0, 0.1)", //green
		 "test": ["sublet", "apartment", "rent", "housing"],
		 "test_color": "rgba(255, 0, 0, 0.1)"
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

	console.log("300")

	if(max_ind == -1) {
		return -1
	}
	picked_color = topics[max_ind] + "_color"
	console.log(picked_color)
	return color[picked_color]
}

function update() {
	run = document.getElementsByClassName("_4-u2 mbm _4mrt _5v3q _4-u8")
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
