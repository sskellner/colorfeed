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

	auth = ""
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

function pick_color2(node){
	low_freq = ["#0FFCE0",
				"#FFA00D",
				"#FEFF1F",
				"#7E42FF",
				"#E8E80A",
				"#FF5300",
				"#CC14B7",
				"#FFDD4C",
				"#4CF8A8",
				"#D148FA",
				"#F45398",
				"#FA237F",
				"#A0FC33",
				"#01C91B",
				"#FFCE00",
				"#02FE52",]
	high_freq = ['#AD9AA5',
				'#BEA0CC',
				'#BAB592',
				'#A2BFA0',
				'#B8CF90',
				'#D1F7FA',
				'#BFA0B2',
				'#54B7BF',
				'#99BCAF',
				'#BCD0EF',
				'#ABB8D7',
				'#839BBF',
				'#83BFA2',
				'#B29783',
				'#A9D6B3',
				'#B0AAC2',]





}

function style2(node, color, freq, alt_url1, alt_url2) {
	//alt_url is a list [icon_url, fb_url]
	// Color: hexcode 0x######
// 	<div class="dropdown">
//   <button class="dropbtn">Dropdown</button>
//   <div class="dropdown-content">
//     <a href="#">Link 1</a>
//     <a href="#">Link 2</a>
//     <a href="#">Link 3</a>
//   </div>
// </div>
	element = document.createElement("div")
	element.className = "dropdown"
	btn = document.createElement("button")
	btn.className = "dropbtn"
	btn.style.backgroundColor = color
	btn.textContent="Colorfeed"
	element.appendChild(btn)

	inside = document.createElement("div")
	inside.className="dropdown-content"
	inside.style="padding:10px;width:200%"
	element.appendChild(inside)

	// Add shit in here

	header = document.createElement("h1")
	str = String(freq)
	percent = str.substring(2, 4)+"."+str.substring(4,6)
	header.textContent = "This source appears in your News Feed "+ percent+"% of the time."
	inside.append(header)
	inside.append(document.createElement("br"))

	header = document.createElement("h1")
	header.textContent = "Check out some more related sources:"
	inside.append(header)
	inside.append(document.createElement("br"))

	others = document.createElement("div")
	others.style="width:100%"
	inside.append(others)

	child1 = document.createElement("div")
	child1_center = document.createElement("center")
	child1.append(child1_center)
	child2 = document.createElement("div")
	child2_center = document.createElement("center")
	child2.append(child2_center)

	others.appendChild(child1)
	others.appendChild(child2)

	child1.style="display:inline-block;align:center;width:50%"
	child2.style="display:inline-block;align:center;width:50%"

	link1 = document.createElement("a")
	child1_center.append(link1)
	inner_im1 = document.createElement("img")
	link1.append(inner_im1)

	link2 = document.createElement("a")
	child2_center.append(link2)
	inner_im2 = document.createElement("img")
	link2.append(inner_im2)

	inner_im1.src = alt_url1[0]
	inner_im2.src = alt_url2[0]
	link1.href = alt_url1[1]
	link1.target="_blank"
	link2.href = alt_url2[1]
	link2.target="_blank"
	inner_im1.style="width:50%"
	inner_im2.style="width:50%"


	node.prepend(element)
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
		t = ["https://scontent.fsnc1-5.fna.fbcdn.net/v/t1.0-1/c64.14.172.172/p200x200/1236510_161973027337310_1766669790_n.jpg?oh=035bfcc61de52d4526a4459fe326aa9e&oe=59824E9D",
			"https://www.facebook.com/sherifinkbooks/"]
		s = ["https://scontent.fsnc1-5.fna.fbcdn.net/v/t1.0-1/p200x200/14117747_632351770280035_6486249289685619428_n.png?oh=049c61d2e14382654a1acff4b65b31d1&oe=5983DCF6",
			"https://www.facebook.com/shareblue/"]
		style2(run[count], "#AD9AA5", .0139, t, s)
		// t = add_storage(run[count])
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
