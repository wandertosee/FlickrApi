
	var RequestModule = {

		// GET CURRENT HASH INDEX VALUE
		getHashIndex: function() {
			return window.location.hash.match(/\d+/) | 0;
		},

		setHash: function(data) {
			return window.location.hash = "#" + data;
		},
					
		// GET PARAM
		getParameterByName: function(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
			results = regex.exec(location.search);
			return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		},

		// MAKE JSON REQUEST
		 requestJsonP: function(scriptSrc) {
			var doc = window.document;
			var script = window.document.createElement('script');
			script.type = 'text/javascript';
			script.src = scriptSrc;
			document.head.appendChild(script);
		}

	};

	// FLICKRWIDGET
	// NOT LOCALIZED
	var s, FlickrWidget = {

		// CALLBACK is jsonFlickrApi unless definied in querystring as jsoncallback
		jsoncallback : "FlickrWidget.passJsonToFlickrWidget",

		// INIT FLICKRWIDGET
		init: function(config) {
			s = this.settings;
			this.addUIConfig(config);
			var photoset_id = RequestModule.getParameterByName("s");

			if (photoset_id.length === 0) {
				s.imageID.style.visibility = "hidden";
				s.imageTitleID.innerHTML = "Please supply a photoset id." + s.photoSetForm;
			} else {
				this.bindUIActions();
				window.onhashchange = this.displayImage;
				window.location.hash = RequestModule.getHashIndex();
			}
		},
		
		// SETTINGS
		settings: {
			photoSetForm: "<div><form><input name='s' value=''><input type='submit' value='Go'></form></div>",
			images: [],
			i : 0
		},

		// SET FLICKRAPI URL
		// SETUP URL TO MAKE JSON REQUEST
		 getFlickrPhotoSetUrl: function(api_key) {
			// PREPARE FLICKR URL AND GET PARAMS
			var photoset_id = RequestModule.getParameterByName("s");
			var flickrApiBaseUrl = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&format=json';
			return flickrApiBaseUrl + "&api_key=" + api_key + "&jsoncallback=" + FlickrWidget.jsoncallback  + "&photoset_id=" + photoset_id;
		},		

		// CALL BACK AND HAND OFF TO FLICKRWIDGET
		 passJsonToFlickrWidget: function(data) {
			if (data.stat === "fail") {
				FlickrWidget.photoSetNotFound(data.message);
			} else {
				FlickrWidget.setImages(data.photoset);
			}				
		},

		// UI ELEMENTS CONFIG
		addUIConfig: function(config) {
			s.prevButtonID = config.prevButtonID;
			s.nextButtonID = config.nextButtonID;
			s.imageID = config.imageID;
			s.imageTitleID = config.imageTitleID;
		},

		// PROCESS RESULT
		setImages: function(data) {
			s.imageID.style.visibility = "initial";
			var length = data.photo.length;
			for (i = 0; i < length; i++) { 
				var picObj = {};
				picObj["title"] = data.ownername + " - " + data.title + " - " + data.photo[i].title;
				picObj["image"] = 'http://farm' + data.photo[i].farm + '.static.flickr.com/' + 
				data.photo[i].server + '/' + data.photo[i].id + '_' + data.photo[i].secret + '_b.jpg';
				s.images.push(picObj);
			}
			FlickrWidget.displayImage();
		},
		
		// PROCESS ERROR
		// NOT LOCALIZED
		photoSetNotFound: function(data) {
			s.imageTitleID.innerHTML = data + "<br />Please supply a photoset id." + s.photoSetForm;
		},

		// SET UP UI / EVENT LISTENERS
		bindUIActions: function() {	
			s.nextButtonID.addEventListener('click', function () {
				var i = RequestModule.getHashIndex();
				i++;
				RequestModule.setHash(i);
			}, false);
			s.prevButtonID.addEventListener('click', function() {
				var i = RequestModule.getHashIndex();
				i--;
				RequestModule.setHash(i);
			}, false);
			window.addEventListener("hashchange", function() {
				this.displayImage;
			}, false);
		},

		// SET NAVIGATION - PREVIOUS / NEXT
		checkNavigationVisibility: function() {
			if (s.i === 0) {
				s.prevButtonID.style.visibility = "hidden";
			} else {
				s.prevButtonID.style.visibility = "initial";					
			}
			if (s.i === s.images.length - 1) {
				s.nextButtonID.style.visibility = "hidden";
			} else {
				s.nextButtonID.style.visibility = "initial";
			}
		},	
		
		// SET IMAGE DISPLAY
		displayImage: function() {
			var i = RequestModule.getHashIndex();
			if (i >= s.images.length - 1) {
				window.location.hash = "#" + 0;
			}
			s.i = i;
			s.imageID.src = s.images[i].image;
			s.imageID.style.visibility = "initial";
			s.imageID.alt = s.images[i].title;
			s.imageTitleID.innerHTML = s.images[i].title;
			FlickrWidget.checkNavigationVisibility();
		}

	};
