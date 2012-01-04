function onBodyLoad()
{		
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady()
{
   
}

//GEOLOC START
var onSuccess = function(position) {
	getResults(position.coords.latitude+','+position.coords.longitude);
};	

// onError Callback receives a PositionError object
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
//GEOLOC STOP

//Ajout de la liste
function manageList(list,val,counter,isArray)
{
	if(!isArray)
	{
		$('#results #content #map').gmap('addMarker', { 'position': new google.maps.LatLng(val.longitude,val.latitude ), 'bounds': true ,'zoom':3 },function(map, marker){
			$('#results #content #map').gmap('addInfoWindow', { 'position':marker.getPosition(), 'content': val.name }, function(iw) {
				$(marker).click(function() {
					iw.open(map, marker);
					map.panTo(marker.getPosition());
				});                                                                                                                                                                                                                               
			});
		});
		list.append('<li><a class="listClick" id="'+counter+'" data-url="details&ui-page=listview-1" data-transition="flip" ><img src="'+val.thumb+'"/><h3>'+val.name+'</h3></a></li>');
	} else
	{
		var listHtml = '<li><a class="ilistClick" id="'+counter+'"data-transition="flip" ><img src="'+val[0].thumb+'"/><h3>'+val[0].name+'</h3></a><span class="ui-li-count">'+val.length+'</span></li>';
			$('#results #content #map').gmap('addMarker', { 'position': new google.maps.LatLng(val[0].longitude,val[0].latitude ), 'bounds': true ,'zoom':3},function(map, marker){
				$('#results #content #map').gmap('addInfoWindow', { 'position':marker.getPosition(), 'content': val[0].name }, function(iw) {
					$(marker).click(function() {
						iw.open(map, marker);
						map.panTo(marker.getPosition()); 
					});                                                                                                                                                                                                                               
				});	
			});
		list.append(listHtml);
	}
}

function clickIListHandler(evt)
{
	var data = ajaxObject[evt.currentTarget.id];


	var listHtml ='<ul data-role="listview" id="listeChambres" data-inset="true">';
	var list = $("#resultsListe #content #listeChambres");
	for(var i = 0;i<data.length;i++)
	{
		listHtml+=('<li><a class="listClick" id="'+evt.currentTarget.id+'_'+i+'" data-url="details&ui-page=listview-1" data-transition="flip" ><img src="'+data[i].thumb+'"/><h3>'+data[i].name+'</h3></a></li>');
	}
	listHtml+='</ul>'
	$("#resultsListe #content").html(listHtml);
	$("#resultsListe #content #listeChambres .listClick").bind({click:function(e){clickHandler(e)}});
	$.mobile.changePage($("#resultsListe"));
	$("#resultsListe").trigger('create');
}


function clickItineraireHandler(evt,args)
{
	var myLatitude, myLongitude, contentHtml;
	navigator.geolocation.getCurrentPosition(function(position){
			console.log("test1");
	        myLatitude = position.coords.latitude;
	        myLongitude = position.coords.longitude;
			console.log(	$("#itineraire").html());
			$("#itineraire #content #map").gmap({ "center": new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
				 $('#itineraire #content #map').gmap('displayDirections', { 'origin': new google.maps.LatLng(50.4541,3.9523), 'destination': new google.maps.LatLng(50.4167, 4.43333 ), 'travelMode': google.maps.DirectionsTravelMode.DRIVING, 'unitSystem': google.maps.UnitSystem.METRIC },{ 'panel': document.getElementById('directions')}, function(success, result) {
                         if ( success ){} else{alert("Data not received")}     
                 	});

             }});
	});
	$.mobile.changePage($("#itineraire"));
}

function clickHandler(evt)
{
	var doubleIdIndex = evt.currentTarget.id.indexOf('_');
	var id,arrayId;
	if(doubleIdIndex != -1)
	{
		id =evt.currentTarget.id.slice(0,doubleIdIndex);
		arrayId = evt.currentTarget.id.slice(doubleIdIndex+1,evt.currentTarget.id.length)
	} else
	{
		id = evt.currentTarget.id;
	}
	
	var data = ajaxObject[id];

	if($.isArray(data))
	{
		data = data[arrayId];
	}

	var ajaxPhotos  = new Array();
	var tplArr = data.photos;
	for(var i = 0; i < tplArr.length;i++)
	{
		ajaxPhotos.push({'src':tplArr[i]});
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
		owner_www : data.owner.website,
		longitude : data.longitude,
		latitude : data.latitude,
		photos : ajaxPhotos
		
	};
	
	detailTpl=ich.detailTpl(tplData);
	$("#details #header .titre").html(data.name);
	$("#details #content").html(detailTpl);

	$("#details #content .itineraireClick").bind({click:function(e){clickItineraireHandler(e,{ longitude: data.longitude,latitude : data.latitude })}});
	$('#details #content .pix_diapo').diapo();	
	$.mobile.changePage($("#details"));
}


function getResults(address)
{
	if(address == null){
		address ="hyon";
	}
	$.mobile.showPageLoadingMsg();
	$("#results #content #map").gmap({'callback': function() {}});
	$("#results #content #map").gmap('clearMarkers');
	$.getJSON("http://clavius.affinitic.be:8877/plone/fr/getMobileClosestHebs?address="+address, {}, 
        function(data) {		
            	ajaxObject = data.results;
            	var items=data.results;
            	var list = $("#results #content #ajaxResults #list");
            	list.html("");
            	var counter = 0;
            	$.each(items, function(key, val) {
					if(!$.isArray(items[key])){
						manageList(list,val,counter,false);
					} else
					{
						manageList(list,val,counter,true);
					}
					counter++;
				});
				$(".listClick").bind({click:function(e){clickHandler(e)}});
				$(".ilistClick").bind({click:function(e){clickIListHandler(e)}});
				
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