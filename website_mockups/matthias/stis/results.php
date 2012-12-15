<?php
include 'common.php';
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php echo $lang['STIS_PAGE_TITLE']; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
	<?php echo $lang['STIS_LANGUAGE']; ?>
	
    <!-- Le styles -->
    <link href="/assets/css/bootstrap.css" rel="stylesheet">
    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
    </style>
    <style type="text/css">
      html, body, #map {
          width: 100%;
          height: 80%;
          margin: 0;
          
      }
      img {max-width:none}
		
    </style>
    <link href="/assets/css/bootstrap-responsive.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="shortcut icon" href="/assets/ico/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/assets/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/assets/ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/assets/ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="/assets/ico/apple-touch-icon-57-precomposed.png">
  </head>
  
  <script src="http://www.openlayers.org/api/OpenLayers.js"></script>
    <script>
      function init() {
        map = new OpenLayers.Map("map");
        var mapnik = new OpenLayers.Layer.OSM();
        map.addLayer(mapnik);
        map.setCenter(new OpenLayers.LonLat(7.3,52.0) // Center of the map
          .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
          ), 10 // Zoom level
        );
      }
    </script>
    
    <script type="text/javascript">
		function showValue1(newValue)
		{
			document.getElementById("range1").innerHTML=newValue;
		}
		function showValue2(newValue)
		{
			document.getElementById("range2").innerHTML=newValue;
		}
		
	</script>

  <body onload="init();">

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">Biographical Thesaurus NRW</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li><a href="stis.php">Home</a></li>
              <li><a href="search.php">Search</a></li>
              <li><a href="explore.php">Explore</a></li>
              <li class="active"><a href="#">Results</a></li>
<!--
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
-->
            </ul>
			<div style="padding: 10px 20px 10px;" align="right" class="text"><?php echo $lang['SELECT LANGUAGE']; ?> <a href="?lang=de"><img src="assets/flags/de.png" alt="Deutsch"/></a> <a href="?lang=en"><img src="assets/flags/gb.png" alt="English"/></a></div>			
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

	<div class="container">
		<h1>Thesaurus Result Map</h1>
	</div>
    <div id="map"></div>
    <div class="container">
	<table>
		<tr>
			<td> 
				<p>Earliest result:</p>
				<input type="range" min="1335" max="1965" value="1335" step="1" onchange="showValue1(this.value)" />
				<span id="range1">0</span>
			</td>
			<td>
				<p>Latest result:</p>
				<input type="range" min="1335" max="1965" value="1965" step="1" onchange="showValue2(this.value)" />
				<span id="range2">0</span>
			</td>
		</tr>
	</table>
		
    </div>
   
    <div class="container">
			<h1>Thesaurus Search Results</h1>
			<p>Filter results depending on the column in the results table.</p>
			<table class="table">
				<tr>
					<td>Number </td>
					<td>Author </td>
					<td>Publication </td>
					<td>Link </td>
				</tr>
				<tr>
					<td>1 </td>
					<td>Author1 </td>
					<td>Title1 </td>
					<td>LINK </td>
				</tr>
				<tr>
					<td>2 </td>
					<td>Author2 </td>
					<td>Title2 </td>
					<td>LINK </td>
				</tr>
				<tr>
					<td>3 </td>
					<td>Author3 </td>
					<td>Title3 </td>
					<td>LINK </td>
				</tr>
			</table>
    </div>

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="/assets/js/jquery.js"></script>
    <script src="/assets/js/bootstrap-transition.js"></script>
    <script src="/assets/js/bootstrap-alert.js"></script>
    <script src="/assets/js/bootstrap-modal.js"></script>
    <script src="/assets/js/bootstrap-dropdown.js"></script>
    <script src="/assets/js/bootstrap-scrollspy.js"></script>
    <script src="/assets/js/bootstrap-tab.js"></script>
    <script src="/assets/js/bootstrap-tooltip.js"></script>
    <script src="/assets/js/bootstrap-popover.js"></script>
    <script src="/assets/js/bootstrap-button.js"></script>
    <script src="/assets/js/bootstrap-collapse.js"></script>
    <script src="/assets/js/bootstrap-carousel.js"></script>
    <script src="/assets/js/bootstrap-typeahead.js"></script>

  </body>
</html>
