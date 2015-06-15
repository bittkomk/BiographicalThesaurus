$(document).ready(function () {
	/*** Variables
	*
	*/
	var map = new Map('map').setView([51.962797, 7.621200], 8),
		selectedDate = null,
		//lastDate = null,
		era,
		eraChangeFlag = false,
		profession_data,
		place_data,
		data_loaded = 0,
		_place = getParam('place'),
		_person = getParam('person'),
		_pType = getParam('pType'),
		_start = getParam('beginDate'),
		_end = getParam('endDate'),
		_occ = getParam('occ'),
		_era = getParam('era'),
		mapLink ='<a href="http://openstreetmap.org">OpenStreetMap</a>',
		tilelayer = L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
		{
	        attribution: 'Map data &copy; ' + mapLink,
	        maxZoom: 18,
		}),
		$selectOcc = $('#select-occ').selectize({
			sortField: {field: 'occupation'},
			valueField: 'occupation',
			labelField: 'occupation',
			searchField: 'occupation',
			openOnFocus: false,
			maxOptions: 10000
		}),
    	$selectPlace = $('#select-place').selectize({
			sortField: {field: 'place'},
			valueField: 'place',
			labelField: 'place',
			searchField: 'place',
			openOnFocus: false,
			maxOptions: 10000			
		}),
		selectizeOcc = $selectOcc[0].selectize,
		selectizePlace = $selectPlace[0].selectize;


	$("input").keypress(function(event) {
		if(event.which == 13) {
			//console.log("pressed return key");
			event.preventDefault();
			goToResults();
		}
	});

/*	$("#beginDate, #endDate").keydown(function(event) {
		lastDate = $(event.currentTarget).val();
	}); 	*/

	$("#beginDate, #endDate").keyup(function(event) {
			
		// Reset era selector
		$("#eraSelector").val(0);
	});
		

	
	/*** Functions
	*
	*/

	/* Cf. http://stackoverflow.com/questions/12147410/different-utf-8-signature-for-same-diacritics-umlauts-2-binary-ways-to-write and http://www.utf8-chartable.de/unicode-utf8-table.pl?start=768 for some context info */
	function removeStrangeUmlautChars(str) {
		str = str.replace(/O\u0308/g, "Ö");
		str = str.replace(/o\u0308/g, "ö");
		str = str.replace(/U\u0308/g, "Ü");
		str = str.replace(/u\u0308/g, "ü");
		str = str.replace(/A\u0308/g, "Ä");
		str = str.replace(/a\u0308/g, "ä");

		return str;
	}

	function insertStrangeUmlautChars(str) {		
		str = str.replace(/Ö/g, "O\u0308");
		str = str.replace(/ö/g, "o\u0308");
		str = str.replace(/Ü/g, "U\u0308");
		str = str.replace(/ü/g, "u\u0308");
		str = str.replace(/Ä/g, "A\u0308");
		str = str.replace(/ä/g, "a\u0308");

		return str;
	}

	/***
	* Extract parameter from the URL
	*/
	function getParam(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) {
				return pair[1];
			}
		}
		return (false);
	};


	function restoreTerm(term) {
		
		var restoredTerm =  unquoteSearchTerm(removeStrangeUmlautChars(decodeURI(term)));
		console.log("restore term", term, "to", restoredTerm);
		return restoredTerm;
	}
	
	/***
	* Restore values after reloading the page.
	* Values are stored in the URL.
	*/
	function restoreValues() {
		if(_place) {
			var tmp = _place;
			//console.log("try restoring place: ", _place);
			try {
				_place = decodeURI(_place);
				_place = JSON.parse(_place);
				if(_place.type == "Circle") {
					_place.wkt = "CIRCLE(" + _place.coordinates + " d=" + _place.radius + ")";
				}
			} catch(e) {
				// place is no object, so place is a city and not a polygon or circle

			}
			if(typeof _place != 'string') {
				map.drawShape(_place.wkt, _place.type);
			}
			else {
				//console.log("restore place form url", _place, decodeURI(_place));
				_place = tmp;
				$("#select-place").text(restoreTerm(_place));
				selectizePlace.setValue(restoreTerm(_place));
				selectizePlace.setTextboxValue(restoreTerm(_place));
			}
		}
		if(_person) {
			$('#person').val(restoreTerm(_person));
			$('#person').text(restoreTerm(_person));
		}
		if(_pType) {
			_pType = _pType.split(',');
			$('#box_birthplace').prop('checked', false);
			$('#box_deathplace').prop('checked', false);
			$('#box_activityplace').prop('checked', false);
			$.each(_pType, function (index) {
				if(_pType[index] == 'Birth'){
					$('#box_birthplace').prop('checked', true);
				}
				if(_pType[index] == 'Death'){
					$('#box_deathplace').prop('checked', true);
				}
				if(_pType[index] == 'Activity'){
					$('#box_activityplace').prop('checked', true);
				}
			});
		}
		if(_start) {
			//selectedDate = {min: _start, max: selectedDate.max};
			//$("#slider").editRangeSlider("values", selectedDate.min, selectedDate.max);
			$("#beginDate").val(_start);
		}
		if(_end) {
			//selectedDate = {min: selectedDate.min, max: _end};
			//$("#slider").editRangeSlider("values", selectedDate.min, selectedDate.max);
			$("#endDate").val(_end);
		}
		if(_occ) {
			$("#select-occ").text(restoreTerm(_occ));
			selectizeOcc.setValue(restoreTerm(_occ));
			selectizeOcc.setTextboxValue(restoreTerm(_occ));
		}
		if(_era) {
			eraChangeFlag = true;
			$("#eraSelector").val(_era);
		}
	}

	/***
	* Initialize the slider, set the values and add Listener for Changed Values
	*/
/*	function initSlider() {
		$("#slider").editRangeSlider({
			bounds: {min: -500, max: new Date().getFullYear()},
			defaultValues:{min: 0, max: new Date().getFullYear()},
			arrows:false,
			symmetricPositionning: true,
  			range: {min: 0},
  			step:1,
			scales: [
				// Primary scale
				{
					first: function(val){ return val; },
					next: function(val){ return val + 500; },
					stop: function(val){ return false; },
					label: function(val){ return val; },
					format: function(tickContainer, tickStart, tickEnd){ 
						tickContainer.addClass("myCustomClass");
					}
				},
				// Secondary scale
				{
					first: function(val){ return val; },
					next: function(val){
						if (val % 10 === 9){
							return val + 2;
						}
						return val + 100;
					},
					stop: function(val){ return false; },
					label: function(){ return null; }
				}
			]
		});
		selectedDate = {min: $("#slider").editRangeSlider("values").min, max: $("#slider").editRangeSlider("values").max};

		$("#slider").bind("valuesChanged", function(e, data){
			if(!eraChangeFlag) {
				$("#eraSelector")[0].selectedIndex = 0;
				$("#box_slider").show();
				era = null;
			}
			eraChangeFlag = false;
			selectedDate = {min: data.values.min, max: data.values.max};
		});
	}*/


	function quoteSearchTerm(term) {
		// check whether term is unquoted string that does not
		// serialize a json object...
		if(term.indexOf("{") == -1 && term.indexOf(" ") > -1) {
			term = "\"" + term + "\"";
			term = term.replace(/\"\"/g, "\"");
			return term;
		}
		else {
			return term;
		}
		
	}


	function unquoteSearchTerm(term) {
		if(term.indexOf("{") == -1 && term.indexOf("\"") > -1) {
			term = term.replace(/\"/g, "");
			return term;
		}
		else {
			return term;
		}
	}



	function checkYearConstraints(beginYear, endYear) {
		if(parseInt(beginYear) > parseInt(endYear)) {
			alert("Jahr (von) darf nicht größer als Jahr (bis) sein");	
			return false;
		}

		if(parseInt(beginYear) > new Date().getFullYear()) {
			alert("Jahr (von) liegt in der Zukunft");
			return false;
		}

		if(parseInt(endYear) > new Date().getFullYear()) {
			alert("Jahr (bis) liegt in der Zukunft");
			return false;
		}
		
		if("-" == beginYear || !(/^\-?\d{0,4}$/.test(beginYear))) {
			alert("Ungültiges Jahr (von)");
			return false;
		}
		
		if("-" == endYear || !(/^\-?\d{0,4}$/.test(endYear))) {
			alert("Ungültiges Jahr (bis)");
			return false;
		}

		return true;
	}
	/***
	* Get all data inserted into the form and go to the results page
	*/
	function goToResults() {
		var person = $('#person').val();
		var occ = $('#select-occ').text();
		var place = insertStrangeUmlautChars($('#select-place').text());
		placeTmp = map.returnPolygonShape();
		if(placeTmp) {
			place = placeTmp;
		}

		//has to be redone
		placetype = [];
		if ($('#box_deathplace').is(':checked')) {
			placetype.push("Death");
		}
		if ($('#box_activityplace').is(':checked')) {
		   placetype.push("Activity");
		}
		if ($('#box_birthplace').is(':checked')) {
		   placetype.push("Birth");   
		}	
		
		startdate = $("#beginDate").val();
		enddate = $("#endDate").val();
	/*	if(selectedDate) {
			startdate = selectedDate.min;
			enddate = selectedDate.max;
		}*/
		if(!checkYearConstraints(startdate, enddate)) {
			return;
		}

		var suffix = "results.php?core=gnd&";
		var target = '';
		var targetControl = target;
		if (person && person != "") {
			target += "person=" + person;
		}
		if(startdate && startdate != "" && startdate != "-") {
			if(target != targetControl) {
				target += "&"
			}
			target += "beginDate=" + startdate;
		}
		if(enddate && enddate != "" && enddate != "-") {
			if(target != targetControl) {
				target += "&"
			}
			target += "endDate=" + enddate;
		}
		if (occ && occ != "") {
			if(target != targetControl) {
				target += "&"
			}
			target += "occ=" + quoteSearchTerm(occ);
		}
		if (place && place != "") {
			if (placetype && placetype != "") {
				if(target != targetControl) {
					target += "&"
				}
				target += "pType=" + placetype[0];
				$.each(placetype, function (index) {
					if(index > 0) {
						target += "," + placetype[index];
					}
				});
			}
			if(target != targetControl) {
				target += "&"
			}
			target += "place=" + quoteSearchTerm(place);
		}

		if(era) {
			if(target != targetControl) {
				target += "&"
			}
			target += "era=" + era;
		}
		var stateObj = { foo: "bar" };
		history.pushState(stateObj, "page 2", "search.php?" + target);
		window.location = suffix + target;
	}

	/*** Events
	*
	*/

	/***
	* Is called when an era is changed
	*/
	$("#eraSelector").on('change', function (e, data) {
		var index = $("#eraSelector option:selected").index();
		era = index;
		eraChangeFlag = true;
		var eras = [{min: null,max: null}, {min: null,max: 500}, {min: 500,max: 1500}, {min: 500,max: 900}, {min: 900,max: 1250}, {min: 1250,max: 1500}, {min: 1500,max: null}, {min: 1500,max: 1800}, {min: 1500,max: 1650}, {min: 1680,max: 1800}, {min: 1800,max: null}, {min: 1800,max: 1870}, {min: 1871,max: 1945}, {min: 1945, max: null} ]
		var startdate = eras[index].min;
		var enddate = eras[index].max;
//		var sliderValues = $("#slider").editRangeSlider("values");
		if(startdate == null) {
			if(enddate == null) {
				startdate = parseInt($("#beginDate").val());//sliderValues.min;
				enddate = parseInt($("#endDate").val());  //sliderValues.max;
			} else {
				startdate = 0;
			}
		} else if(enddate == null) {
			enddate = new Date().getFullYear();
		}
		//$("#slider").editRangeSlider("values", startdate, enddate);
		$("#beginDate").val(startdate);
		$("#endDate").val(enddate);		

		selectedDate = {min: startdate, max: enddate}
	});

	/***
	* Is called when an shape is drawn on the map.
	* Calls a window asking to submit the query.
	*/
	$(map).on('draw:created', function () {
		$( "#dialog-confirm" ).html('<span class="ui-icon ui-icon-circle-check"></span>Wollen Sie die Suche ausführen?');
		$( "#dialog-confirm" ).dialog({
			resizable: false,
			height:200,
			modal: true,
			buttons: {
				"Ja": function() {
					$( this ).dialog( "close" );
					goToResults();
				},
				Nein: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	});

	/***
	* Is called when the submit button is clicked
	*/
	$('#btn-search').on('click', function () {
		goToResults();
	});

	/*** Function Calls
	* 
	*/
	map.addTileLayer(tilelayer);

//	initSlider();
	map.initLeafletDraw();

	$("#beginDate").val(-500);
	$("#endDate").val(new Date().getFullYear());

	//tick checkboxes for place types
	$('#box_birthplace').prop('checked', true);
	$('#box_deathplace').prop('checked', true);
	$('#box_activityplace').prop('checked', true);

	// Query places and professions and add them to the select elements
	suggester = new Suggester();
	suggester.setCore('gnd');
	suggester.setField('professionOrOccupation');
	$.getJSON(suggester.buildURL(), function(result){
		profession_data = result.facet_counts.facet_fields.professionOrOccupation;
		$.each(profession_data, function (index, value) {
			if(index % 2) {
				//do nothing
			} else {
				if((/^[a-z]+/i).test(value)) {
					selectizeOcc.addOption({ id: index/2,
								 occupation: removeStrangeUmlautChars(value) });
				}
			}
		});
		data_loaded ++;
		if(data_loaded == 2) {
			restoreValues();
		}
    });
	suggester.setField('placeOfBirth');
	$.getJSON(suggester.buildURL(), function(result){
		place_data = result.facet_counts.facet_fields.placeOfBirth;
		$.each(place_data, function (index, value) {
			if(index % 2) {
				//do nothing
			} else {
				if((/^[a-z]+/i).test(value)) {
					selectizePlace.addOption({ id: index,
								   place: removeStrangeUmlautChars(value)});
				}
			}
		});
		data_loaded ++;
		if(data_loaded == 2) {
			restoreValues();
		}
    });	

    $("[rel='tooltip']").tooltip();
});
