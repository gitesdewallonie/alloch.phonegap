function onBodyLoad()
{		
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady()
{
   
}

//GEOLOC START
var onSuccess = function(position) {
/*	var html ='Latitude: '+ position.coords.latitude + '<br />' +'Longitude: '+ position.coords.longitude + '<br /><div id="map" style="width:240px; height:340px"> </div><div id="ajaxResults"></div>';
    $("#results #content").html(html);

	$("#results #content #map").gmap({  'callback': function() {
	   	$('#results #content #map').gmap('addMarker', { 'position': new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 'bounds': true ,'zoom': 7} );
	}});
	*/
	getResults(position.coords.latitude+','+position.coords.longitude);
};	

// onError Callback receives a PositionError object
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
//GEOLOC STOP

//Ajout de la liste
function manageList(list,val,counter)
{
		$('#results #content #map').gmap('addMarker', { 'position': new google.maps.LatLng(val.longitude,val.latitude ), 'bounds': true ,'zoom':7 },function(map, marker){
			$('#results #content #map').gmap('addInfoWindow', { 'position':marker.getPosition(), 'content': val.name }, function(iw) {
				$(marker).click(function() {
					iw.open(map, marker);
					map.panTo(marker.getPosition());
				});                                                                                                                                                                                                                               
			});
		});
		list.append('<li><a class="listClick" id="'+counter+'" data-url="details&ui-page=listview-1" data-transition="flip" ><img src="'+val.thumb+'"/><h3>'+val.name+'</h3></a></li>');
}


function clickHandler(evt)
{
	var data = ajaxObject[evt.currentTarget.id];
	console.log(data);
	if($.isArray(data))
	{
		data = data[0];
	}
	var tplData = {
		name:data.name,
		description : data.description,
		capacity_max : data.capacity_max,
		capacity_min : data.capacity_min,
		address :data.address.address,
		zip : data.address.zip,
		city : data.address.city,
		price : data.price,
		room_number : data.room_number,
		two_person_bed : data.two_person_bed,
		child_bed : data.child_bed,
		owner_title : data.owner.title,
		owner_fisrtname : data.owner.firstname,
		owner_name : data.owner.name,
		owner_language : data.owner.language,
		owner_phone : data.owner.phone,
		owner_mobile : data.owner.mobile,
		owner_fax : data.owner.fax,
		owner_email : data.owner.email,
		owner_www : data.owner.website
	};
	
	detailTpl=ich.detailTpl(tplData);
	$("#details #content").html(detailTpl);
	$.mobile.changePage($("#details"));
}


function getResults(address)
{
	if(address == null){
		address ="hyon";
	}
	$.mobile.showPageLoadingMsg();
	$("#results #content").html('<div id="map" style="width:300px; height:260px;"> </div><div id="ajaxResults" style="margin-top:20px;"><ul data-role="listview" id="list"></ul></div><br/>	');
	$("#results #content #map").gmap({  'callback': function() {}});
	$.getJSON(" http://clavius.affinitic.be:8877/plone/getMobileClosestHebs?address="+address, {}, 
        function(data) {		
            	ajaxObject = data.results;
            	var items=data.results;
            	var list = $("#results #content #ajaxResults #list");
            	list.html("");
            	var counter = 0;
            	$.each(items, function(key, val) {
					if(!$.isArray(items[key])){
						manageList(list,val,counter);
					} else
					{
						manageList(list,val[0],counter);
					}
					counter++;
				});
				$(".listClick").bind({click:function(e){clickHandler(e)}});
				
			list.listview('refresh');	
			$.mobile.hidePageLoadingMsg();	
    })
	$('#results').trigger('create');
	
}


$(document).ready(function() {
      var ajaxObject;

       $("#geoLocalise").click(function(e) {
             e.preventDefault();	
             navigator.geolocation.getCurrentPosition(onSuccess, onError);             
          });
		$('#searchClick').click(function(e) {
	             e.preventDefault();

	             getResults($('#addresse').val());
		  });
});