/*
 * This file cares about the auto-complete dropdown menus that are used in the form
 */


//Autocomplete for persons
$( "#person" ).autocomplete(
  {
    source: function( request, response ) {
      suggester = new Query(true, true);
      suggester.setCore("gnd");
      suggester.setRows("100");

      var term = request.term;
      term = term.replace(/,/g, " ");
      suggester.setPerson(term);

//      suggester.setSortField("preferredNameForThePerson");

      var pred = function(t, v) {
		var regex1 = new RegExp("(\\b|^)"+t, "gi");
		//var regex2 = new RegExp("(\b|^)" + t + ".*(\b|$)", "gi");
//		console.log("check regex for", regex1, t, v, ":", regex1.test(v));
		return regex1.test(v) // || regex2.test(v));
      }	

      $.getJSON(suggester.buildURL(), function(result){
      		var tmp = result.response.docs;
      		var data=[];
			
			$.each(tmp, function (index, value) {
				if(_.every(_.compact(term.split(" ")), function(t) {
//					console.log("test prefName:", term, t, value.preferredNameForThePerson);
					return pred(t, value.preferredNameForThePerson)})) { 
					        data.push(value.preferredNameForThePerson);
				}
				if(value.variantNameForThePerson) {
					$.each(value.variantNameForThePerson, function(index, variantName) {
						if(_.every(_.compact(term.split(" ")), function(t) {
								return pred(t, variantName)})) { 							data.push(variantName);
						}
					});
				}
			});     	

	        response($.map(data.sort(), function(item) {
	            return {
	                label : item,
	                value : item
					
	            }
        	}));
      });
    },

    minLength: 2,
    delay: 200
  }
);

 
    
//Autocomplete for places
    
// Autocomplete is built on indexes to keep consistency with the query that is also done on indexes
$( "#place" ).autocomplete(
  {
    source: function( request, response ) {
      suggester = new Suggester();
      suggester.setField("placeOfBirth_tm");
      suggester.setCore("gnd");
      suggester.setSearchTerm(request.term.toLowerCase());

      $.getJSON(suggester.buildURL(), function(result){
        var tmp = result.facet_counts.facet_fields.placeOfBirth;
      	var data=[];
      	var number=[];
        var count = 0;
			
			$.each(tmp, function (index, value) {
        if(count < 7){
          if(index % 2) {
            number.push(value);
            count++;
          } else {
            data.push(value);
          }
        }
			});
        	
			$.each(data, function (index) {
				data[index] = data[index] + " (" + number[index] + ")";
			});
        	

	        response($.map(data, function(item) {
	            return {
	                label : item,
	                value : item
					
	            }
        	}));
      });
    },

    select: function (event, ui) {
    	ui.item.label = ui.item.label.split(" (")[0];
    	ui.item.value = ui.item.value.split(" (")[0];
    },
    minLength: 2,
    delay: 200
  }
);
	
	
 
//Autcomplete for occupations     
$("#occ").autocomplete(
  {
    source: function( request, response ) {
      suggester = new Suggester();
      suggester.setField("professionOrOccupation_tm");
      suggester.setCore("gnd");
      suggester.setSearchTerm(request.term.toLowerCase());

      $.getJSON(suggester.buildURL(), function(result){
        var tmp = result.facet_counts.facet_fields.professionOrOccupation;
    		var data=[];
    		var number=[];
        var count = 0;
			
			$.each(tmp, function (index, value) {
        if(count < 7) {
          if(index % 2) {
            number.push(value);
            count++;
          } else {
            data.push(value);
          }
        }
				
			});

			$.each(data, function (index) {
				data[index] = data[index] + " (" + number[index] + ")";
			});


	        response($.map(data, function(item) {
	            return {
	                label : item,
	                value : item
					
	            }
        	}));
      });
    },

    select: function (event, ui) {
    	ui.item.label = ui.item.label.split(" (")[0];
    	ui.item.value = ui.item.value.split(" (")[0];
    },
    minLength: 2,
    delay: 200
  }
);	
