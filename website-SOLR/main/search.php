<?php
	include 'common.php';
?>
<!DOCTYPE html>
<html lang="de">

	<!-- include the header -->
	<?php include 'header.php' ?>
	
	<meta charset="UTF-8">
		<!-- external css files from Twitter Bootstrap. They are useful for a responsive design -->
    <link href="../assets/css/bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="../assets/css/bootstrap-responsive.css" rel="stylesheet" type="text/css" />


	<!-- Include Stylesheets -->
	<!-- jQuery.ui -->
	<link rel="stylesheet" href="../assets/css/jQuery-1.10.3/jquery-ui.css" type="text/css" /> 
	<!-- Bootstrap -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css">
	
	<link rel="stylesheet" href="../assets/css/selectize.bootstrap3.css">
	<!-- Leaflet -->
	<link rel="stylesheet" href="../assets/leaflet-0.6.4/leaflet.css" type="stylesheet"/>
	<!-- Leaflet.markercluster -->
	<link href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.css" rel="stylesheet">
	<link href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.Default.css" rel="stylesheet">
	<!-- Leaflet.draw -->
	<link rel="stylesheet" href="../assets/leaflet-draw/leaflet.draw.css" type="text/css"/>
	<!-- jQEditRangeSlider -->
	<link href="css/iThing.css" rel="stylesheet" type="text/css" />
	<!-- Custom files -->
	<link href="css/biothe.css" rel="stylesheet" type="text/css" />

	<script>
		dojoConfig = {
			parseOnLoad : true
		}
	</script>
	<!-- include the banner -->
	<?php 
		// specify the current page
		$_SESSION['current_page'] = "search";
		include 'banner/banner.php';
	?>
	<body>
		<div id="wrap">
		<div id="searchContainer" class="container-fluid">
		    <div class="row">
		        <div class="col-xs-7 col-md-5">
		            <form class="form-horizontal">		
						<!-- <fieldset> -->
						

							<div class="form-group">
								<label for="person" class="control-label col-xs-1"><?php echo $lang['SEARCH_POI']; ?>: </label>
								<input id="person" type="text" placeholder="<?php echo $lang['SEARCH_POI2']; ?>" class="selectize-input form-control col-xs-11">
							</div> 
			    <!--</form>-->
			    <!--<form class="form-horizontal">-->

							<div class="form-group">
								<label for="select-occ" class="control-label col-xs-1"><?php echo $lang['SEARCH_OCC']; ?>: </label> 
								<select id="select-occ" class="form-control col-xs-11" placeholder="<?php echo $lang['SEARCH_OCC2']; ?>"></select>
							</div>
			   <!-- </form> -->
			   <!-- <form class="form-inline"> -->

							<div class="form-group">
								<label for="select-place" class="control-label col-xs-1"><?php echo $lang['SEARCH_PLACE2']; ?>: </label>
								<select id="select-place" class="form-control col-xs-11" placeholder="<?php echo $lang['SEARCH_PLACE']; ?>"></select>		
							</div>
									
							<div class="form-group">
								<div class="control-label col-xs-1"></div>
								<div class="col-xs-11 place-checkboxes">
									<label for="box_birthplace" class="checkbox-inline"><?php echo $lang['SEARCH_CHECK_BOX1:']; ?></label>
									<input type="checkbox" class="form-control"  id="box_birthplace">
									<label for="box_deathplace" class="checkbox-inline"><?php echo $lang['SEARCH_CHECK_BOX2:']; ?></label>    				                                           <input type="checkbox" id="box_deathplace">
									<label for="box_activityplace" class="checkbox-inline"><?php echo $lang['SEARCH_CHECK_BOX3:']; ?></label>
									<input type="checkbox" id="box_activityplace" >
								</div>
							</div>
			  <!--</form>-->
			  <!--<form class="form-inline">							-->
							<div class="form-group">				
 								<!-- <div class="form-group"> -->
									<label for="beginDate" class="control-label col-xs-1 "><?php echo $lang['SEARCH_BEGIN_DATE']; ?>: </label><input id="beginDate" type="text" class="selectize-input form-control col-xs-11 small-form-control">
									<label for="endDate">&nbsp;<?php echo $lang['SEARCH_END_DATE']; ?>&nbsp;</label><input id="endDate" type="text" class="selectize-input form-control small-form-control">
						 </div>
			  <!--</form>				-->
		          <!--<form class="form-inline">-->
	 							
							<!--	<div class="form-group">
									<label for="slider"><?php echo $lang['SEARCH_TIME']; ?></label><div id="slider"></div>											   </div> -->

								<div class="form-group"> 
									<label for="eraSelector" class="control-label col-xs-1"><?php echo $lang['SEARCH_ERA']; ?>: </label>
									<select id="eraSelector" class="form-control col-xs-11">
										<option value="0"><?php echo $lang['SEARCH_ERA_CHOICES'][0];?></option>
										<option value="1"><?php echo $lang['SEARCH_ERA_CHOICES'][1];?></option>
										<option value="2"><?php echo $lang['SEARCH_ERA_CHOICES'][2];?></option>
										<option value="3"><?php echo $lang['SEARCH_ERA_CHOICES'][3];?></option>	 	
										<option value="4"><?php echo $lang['SEARCH_ERA_CHOICES'][4];?></option>
										<option value="5"><?php echo $lang['SEARCH_ERA_CHOICES'][5];?></option>
										<option value="6"><?php echo $lang['SEARCH_ERA_CHOICES'][6];?></option>
										<option value="7"><?php echo $lang['SEARCH_ERA_CHOICES'][7];?></option>
										<option value="8"><?php echo $lang['SEARCH_ERA_CHOICES'][8];?></option>
										<option value="9"><?php echo $lang['SEARCH_ERA_CHOICES'][9];?></option>
										<option value="10"><?php echo $lang['SEARCH_ERA_CHOICES'][10];?></option>
										<option value="11"><?php echo $lang['SEARCH_ERA_CHOICES'][11];?></option>
										<option value="12"><?php echo $lang['SEARCH_ERA_CHOICES'][12];?></option>
										<option value="13"><?php echo $lang['SEARCH_ERA_CHOICES'][13];?></option>	 			
									</select>
								</div>

							
						<!-- </fieldset>	 -->
					</form>
					<div class="form-horizontal">
						<div class="form-group">
							<div class="control-label col-xs-1"></div>
							<div class="form-buttons col-xs-11">
								<button class="btn btn-primary" id="btn-search"><?php echo $lang['SEARCH_SUBMIT']; ?></button>
								<button class="btn btn-primary" type="reset" onclick='window.location="search.php"' ><?php echo $lang['SEARCH_RESET']; ?></button>
							</div>
						</div>
					</div>
					<!--</form>-->
				</div>
			<div id="space" class="col-xs-1 col-md-1"></div>
		        <div id="map" class="col-xs-4 col-md-6 pull-right"></div>

		        <div id="dialog-confirm"></div>

		    </div>
		</div>
		</div>

		<!-- include the footer -->
		<?php include 'footer.php'; ?>

		<!-- Le javascript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->

		<!-- jQuery -->
		<script src="../assets/js/jquery.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<!-- jQuery.ui -->
		<script src="../assets/js/jQuery-1.10.3/jquery-ui.js"></script>
		<!-- Bootstrap 
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
		-->
		<script src="../assets/js/bootstrap-transition.js"></script>
		<script src="../assets/js/bootstrap-alert.js"></script>
		<script src="../assets/js/bootstrap-modal.js"></script>
		<script src="../assets/js/bootstrap-dropdown.js"></script>
		<script src="../assets/js/bootstrap-scrollspy.js"></script>
		<script src="../assets/js/bootstrap-tab.js"></script>
		<script src="../assets/js/bootstrap-tooltip.js"></script>
		<script src="../assets/js/bootstrap-popover.js"></script>
		<script src="../assets/js/bootstrap-button.js"></script>
		<script src="../assets/js/bootstrap-collapse.js"></script>
		<script src="../assets/js/bootstrap-carousel.js"></script>
		<script src="../assets/js/bootstrap-typeahead.js"></script>
		<!-- jQEditRangeSlider -->
		<script src="javascript/jQAllRangeSliders-withRuler-min.js"></script>
		<!-- Leaflet -->
		<script src="../assets/leaflet-0.6.4/leaflet.js"></script>
		<!-- Underscore -->
		<script src="../assets/js/underscore-min.js"></script>

		<script src="../assets/js/selectize.min.js"></script>
		<!-- Leaflet.markerCluster -->
		<script src="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js"></script>
		<!-- Leaflet.draw -->
		<?php 
			// select the file for the buttons helping to draw and delete a bounding box on the map according to the current language
			switch ($lang) {
				case 'en':
					echo "<script type='text/javascript' src='../assets/leaflet-draw/leaflet.draw_en.js'></script>";
					break;
				case 'de':
					echo "<script type='text/javascript' src='../assets/leaflet-draw/leaflet.draw_de.js'></script>";
					break;
				default:
					echo "<script type='text/javascript' src='../assets/leaflet-draw/leaflet.draw_de.js'></script>";
			}
		?>

		<!-- Custom files -->
		<script src="javascript/Map.js" type="text/javascript"></script>
		<script src="javascript/search.js"></script>
		<script src="javascript/Query.js"></script>
		<script src="javascript/Suggester.js"></script>
		<script src="javascript/search_autocomplete.js" type="text/javascript"></script>
		<script src="javascript/MarkerIcon.js" type="text/javascript"></script>
	</body>
</html>                 
