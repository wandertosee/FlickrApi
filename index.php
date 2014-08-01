<!doctype html>
<html>
<head>
	 <meta charset="UTF-8">
    <title>Flickr Photoset Browser</title>
	<link rel="stylesheet" href="./css/style.css">
	<script type="text/javascript" src="./js/main.js"></script>
</head>
<body>	
	<div id="flickr-slideshow-pageWrapper">
		<div id="flickr-slideshow-images">
			<div id="flickr-slideshow-imageTitle"></div>
			<span class="flickr-slideshow-previous-Button">&larr;</span>
			<span class="flickr-slideshow-next-Button">&rarr;</span>
			<img src="./img/pixel.gif" id="flickr-slideshow-image" alt="" />
		</div>
	</div>

	<script type="text/javascript">

		(function() {

			// CONFIG QUERY STRING ELEMENTS
			var api_key = "API_KEY_HERE";

			// CONFIGURE UI ELMENTS
			function getConfigElements() {
				var doc = window.document;
				return {
					// MODIFY OR USE
					prevButtonID: doc.querySelector(".flickr-slideshow-previous-Button"),
					nextButtonID: doc.querySelector(".flickr-slideshow-next-Button"),
					imageID: doc.querySelector("#flickr-slideshow-image"),
					imageTitleID: doc.querySelector("#flickr-slideshow-imageTitle")
				};
			}

			// CREATE URL
			var flickrPhotoSetUrl = FlickrWidget.getFlickrPhotoSetUrl(api_key);

			// REQUEST DATA
			RequestModule.requestJsonP(flickrPhotoSetUrl);

			// INITIALIZE FLICKRWIDGET
			FlickrWidget.init(getConfigElements());				

		})();

	</script>
</body>
</html>