var Query = function(personSearch, substringSearch) {
	this.basePath = "http://ubsvirt112.uni-muenster.de:8181/solr/";
	this.core = "collection1";
	this.rows = "20";
	this.spatial = null;
	this.results = null;
	this.person = null;
	this.start = null;
	this.end = null;
	this.activity = null;
	this.spatialField = null;
	this.queryReturn = [];
	this.personSearch = personSearch;
	this.substringSearch = substringSearch || false;
	this.sortField = null;
	this.sortDirection = "asc";
};

Query.prototype.setRows = function (rows) {
	this.rows = rows;
};

Query.prototype.setCore = function (core) {
	this.core = core;
};

Query.prototype.setResults = function (results) {
	this.results = results;
};

Query.prototype.setSpatial = function (spatial) {
	this.spatial = spatial;
};

Query.prototype.addSpatialField = function (spatialField) {
	this.spatialField.push(spatialField);
};

Query.prototype.initSpatialField = function () {
	this.spatialField = [];
};

Query.prototype.setPerson = function (person) {
	this.person = person;
};

Query.prototype.setActivity = function (activity) {
	this.activity = activity;
};

Query.prototype.setStart = function (start) {
	this.start = start;
};

Query.prototype.setEnd = function (end) {
	this.end = end;
};

Query.prototype.setReturn = function (queryReturn) {
	this.queryReturn.push(queryReturn);
};

Query.prototype.setSortField = function (sortField) {
	this.sortField = sortField;
};

Query.prototype.setSortDirection = function (sortDirection) {
	this.sortDirection = sortDirection;
};

/** This function right now is not beeing used. Used before to execute a query and trigger an event after the response got recieved
*
*/
Query.prototype.execute = function () {
	$.getJSON(this.buildURL(), function(result){
		$(this).trigger('gotData', [result.response.docs]);
    });
};

/** Build a URL to query SOLR by the parameters stored in this object
*
*/
Query.prototype.buildURL = function () {
	//Add URL and desired Core
	url = this.basePath + this.core + '/'; 
	
	attributeUsed = false;
	var leftModifier = ""; // (this.substringSearch) ? '*' : '';
	var rightModifier = (this.substringSearch) ? '*' : '';
	
	srchstrng = "select?q=";
	
	if(this.person) {
		if(this.personSearch) {
	    	persons = decodeURIComponent(this.person);
	    	persons = _.compact(persons.split(" "));
	    	$.each(persons, function (index) {
	    		if(index != 0) {
	    			srchstrng += ' AND ';
	    		}
	    		srchstrng += '(preferredNameForThePerson_tm:' + leftModifier + persons[index] + rightModifier;
	    		srchstrng += ' OR variantNameForThePerson_tm:' + leftModifier + persons[index] + rightModifier + ')';
	    	});
			attributeUsed = true;
		} else {
			srchstrng += 'preferredNameForThePerson_tm:' + leftModifier + this.person + rightModifier;
			srchstrng += ' OR variantNameForThePerson_tm:' + leftModifier + this.person + rightModifier;
			attributeUsed = true;
		}
	}
	

	if(this.activity) {
		if(attributeUsed) {
			srchstrng += ' AND ';
		}
		srchstrng += 'professionsOrOccupations:' + this.activity;
		attributeUsed = true;
	}
	



	if(this.start) {
		if(this.end) {
			if(attributeUsed) {
				srchstrng += ' AND ';
			}
			if(this.core == 'gnd') {
				srchstrng += '((yearOfBirth:[' + this.start + ' TO ' + this.end + ']';
				srchstrng += ' OR yearOfDeath:[' + this.start + ' TO ' + this.end + '])';
				srchstrng += ' OR (yearOfBirth:[-500 TO ' + this.start + ']';
				srchstrng += ' AND yearOfDeath:[' + this.end + ' TO 2100]))';
			} else {
				srchstrng += '(dateOfBirth:[' + this.start + ' TO ' + this.end + ']';
				srchstrng += 'dateOfDeath:[' + this.start + ' TO ' + this.end + '])';
			}
			
		} else {
			if(attributeUsed) {
				srchstrng += ' AND ';
			}
			if(this.core == 'gnd') {
				srchstrng += '(yearOfBirth:[' + this.start + ' TO ' + new Date().getFullYear() + ']';
				srchstrng += ' OR yearOfDeath:[' + this.start + ' TO ' + new Date().getFullYear() + '])';
			} else {
				srchstrng += '(dateOfBirth:[' + this.start + ' TO ' + new Date().getFullYear() + ']';
				srchstrng += ' OR dateOfDeath:[' + this.start + ' TO ' + new Date().getFullYear() + '])';
			}
		}
		attributeUsed = true;
	}else {
		if(this.end) {
			if(attributeUsed) {
				srchstrng += ' AND ';
			}
			if(this.core == 'gnd') {
				srchstrng += '(yearOfBirth:[-500 TO ' + this.end + ']';
				srchstrng += ' OR yearOfDeath:[-500 TO ' + this.end + '])';
			} else {
				srchstrng += '(dateOfBirth:[-500 TO ' + this.end + ']';
				srchstrng += 'dateOfDeath:[-500 TO ' + this.end + '])';
			}
			attributeUsed = true;
		}
		
	}
	


	var spatialUrl = "";

	//Add Spatial Restraints
	var that = this;
	if(this.spatial) {
		if(this.spatial.type == "Circle" || this.spatial.type == "Polygon") {
			$.each(this.spatialField, function (index) {
				if(index == 0)  {
					spatialUrl += '&fq=' + that.spatialField[index] + '_geom:"IsWithin(' + that.spatial.wkt + ') distErrPct=0"';
				} else {
					spatialUrl += ' OR ';
					spatialUrl += that.spatialField[index] + '_geom:"IsWithin(' + that.spatial.wkt + ') distErrPct=0"';
				}
			});
		} else {
			if(attributeUsed) {
				srchstrng += ' AND (';
			}
			$.each(this.spatialField, function (index) {
				if(index == 0) {
					srchstrng += that.spatialField[index] + "_tm:\"" + that.spatial + "\"";
				} else {
					srchstrng += ' OR '
					srchstrng += that.spatialField[index] + "_tm:\"" + that.spatial + "\"";
				}
				if(attributeUsed) {
					if(index == that.spatialField.length - 1) {
						srchstrng += ')';
					}
				}
			});
			
			attributeUsed = true;
		}
	}		


	if(!attributeUsed) {
		//Select All and Response all Fields
		srchstrng = 'select?q=*:*';
	}

	url += srchstrng;


	if(this.sortField) {
		url += "&sort=" + this.sortField + "+" + this.sortDirection;
	}

	url += spatialUrl;

	if (this.queryReturn && this.queryReturn.length != 0) {
		url += '&fl=';
		var that = this;
		$.each(this.queryReturn, function (index) {
			if(index == 0) {
				url += that.queryReturn[index];
			} else {
				url += ',' + that.queryReturn[index];
			}
		});
	}
	url += '&rows=' + this.rows;
	url += '&wt=json&json.wrf=?&indent=true'
	return url;
};
