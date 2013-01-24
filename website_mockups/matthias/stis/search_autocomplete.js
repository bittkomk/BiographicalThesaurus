var prefixes = "prefix stis: <http://localhost/default#>\n" 
				+"prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
				+"prefix gnd: <http://d-nb.info/standards/elementset/gnd#>\n"
				+"prefix dc: <http://purl.org/dc/terms/>\n";
				
var limit =" Limit 7";


   $( "#subject" ).autocomplete(
        {
      source: function( request, response ) {          
          
          var query = prefixes+
					"select distinct ?subjectName where{\r\n" + 
					" ?publicationUri a stis:Publication .\r\n" + 
					" ?publicationUri <http://purl.org/dc/terms/subject> ?subjectURI.\r\n" + 
					" ?subjectURI gnd:preferredName ?subjectName FILTER regex(?subjectName, \""+request.term+"\", \"i\").\r\n" + 
					"}"+limit;
          
          
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.subjectName.value,
                            value : item.subjectName.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 alert(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 300
    }
    );
    
    
   $( "#person" ).autocomplete(
        {
      source: function( request, response ) {
          //String.split()
          var regex = request.term.split(" ");
          var filter="";
          for(var i=0,j=regex.length; i<j; i++){
            filter+="filter regex(?c, \""+regex[i]+"\",\"i\") ";
          };
          
          var query = prefixes+
          			  "select distinct ?Result where{ ?c  gnd:preferredNameForThePerson ?Result.}"+limit;
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.Result.value,
                            value : item.Result.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 alert(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 200
    }
    );
    
    
   $( "#author" ).autocomplete(
        {
      source: function( request, response ) {
          //String.split()
          var regex = request.term.split(" ");
          var filter="";
          for(var i=0,j=regex.length; i<j; i++){
            filter+="filter regex(?c, \""+regex[i]+"\",\"i\") ";
          };
          
          var query = prefixes+
          					"select distinct (?a as ?publicationUri) ?title ?name where{\r\n" + 
		"{\r\n" + 
		" ?a a stis:Publication;\r\n" + 
		" <http://iflastandards.info/ns/isbd/elements/P1004> ?title\r\n" + 
		"} \r\n" + 
		"union {\r\n" + 
		" ?a a stis:Publication;\r\n" + 
		" gnd:preferredNameForTheWork ?title.\r\n" + 
		"}\r\n" + 
		"{\r\n" + 
		"{\r\n" + 
		"?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p <http://xmlns.com/foaf/0.1/name> ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p <http://www.w3.org/2000/01/rdf-schema#label> ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p gnd:variantName ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p <http://rdvocab.info/ElementsGr2/variantNameForThePerson> ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p gnd:variantNameForThePerson ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p gnd:preferredName ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p gnd:preferredNameForThePerson ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p <http://rdvocab.info/ElementsGr2/preferredNameForThePerson> ?name .\r\n" + 
		"}\r\n" + 
		"FILTER regex(?name, \""+request.term+"\",\"i\")\r\n" + 
		"}\r\n" + 
		"}"+limit;
		
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.name.value,
                            value : item.name.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 alert(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 300
    }
    );
    
    
   $( "#publication" ).autocomplete(
        {
      source: function( request, response ) {
          //String.split()
          var regex = request.term.split(" ");
          var filter="";
          for(var i=0,j=regex.length; i<j; i++){
            filter+="filter regex(?c, \""+regex[i]+"\",\"i\") ";
          };
          
          var query = prefixes+
          			"select distinct (?b as ?name) where {{\r\n" + 
					" ?a a stis:Publication;\r\n" + 
					" <http://iflastandards.info/ns/isbd/elements/P1004> ?b;\r\n" + 
					"} \r\n" + 
					"union {\r\n" + 
					" ?a a stis:Publication;\r\n" + 
					" gnd:preferredNameForTheWork ?b.\r\n" + 
					"}\r\n" + 
					"FILTER regex(?b, \""+ request.term+"\", \"i\")\r\n" + 
					"}"+limit
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.name.value,
                            value : item.name.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 alert(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 300
    }
    );
    
    
    $( "#place" ).autocomplete(
        {
      source: function( request, response ) {
          //String.split()
          var regex = request.term.split(" ");
          var filter="";
          for(var i=0,j=regex.length; i<j; i++){
            filter+="filter regex(?c, \""+regex[i]+"\",\"i\") ";
          };
          
          var query = prefixes+
			"select distinct (?locationName as ?Result) where{\r\n" + 
			"{\r\n" + 
			"	?a <http://iflastandards.info/ns/isbd/elements/P1016> ?locationName .\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:placeOfBirth ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:placeOfDeath ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:placeOfBusiness ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:associatedPlace ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:characteristicPlace ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:placeOfConferenceOrEvent ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:otherPlace ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:place ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:placeOfManufacture ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:placeOfExile ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:placeOfDiscovery ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:placeOfCustody ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}union{\r\n" + 
			"	?a gnd:placeOfActivity ?location.\r\n" + 
			"        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n" + 
			"}\r\n" + 
			"FILTER regex(?locationName, \""+request.term+"\",\"i\")\r\n" + 
			"}" + limit;     				
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.Result.value,
                            value : item.Result.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 alert(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 300
    }
    );
    
    
    