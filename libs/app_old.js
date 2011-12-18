


//Lien call ajax pour POC
//http://gitesdewallonie.be/selectedDays?hebPk=81&month=1&year=2012&range=1

// google
//http://maps.googleapis.com/maps/api/geocode/json?address=XXX&sensor=false

// If you want to prevent dragging, uncomment this section
/*
function preventBehavior(e) 
{ 
  e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, false);
*/

/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
for more details -jm */
/*
function handleOpenURL(url)
{
	// TODO: do something with the url passed in.
}
*/

function onBodyLoad()
{		
	document.addEventListener("deviceready", onDeviceReady, false);
}

/* When this function is called, PhoneGap has been initialized and is ready to roll */
/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
for more details -jm */

function onDeviceReady()
{
   
}

//geoloc functions
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
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
/////end hgeoloc functions


function getResults(address)
{
	if(address == null){
		address ="hyon";
	}
   $("#results #content").html('<div id="map" style="width:300px; height:260px;"> </div><div id="ajaxResults" style="margin-top:20px;"><ul data-role="listview" id="list"></ul></div><br/>	');
	$("#results #content #map").gmap({  'callback': function() {
	   //	$('#results #content #map').gmap('addMarker', { 'position': new google.maps.LatLng(50.428, 3.95010), 'bounds': true } );
	}});
   $.getJSON(" http://clavius.affinitic.be:8877/plone/getMobileClosestHebs?address="+address, {}, 
        function(data) {		
				console.log(data);
            	ajaxObject = data.results;
            	var items=data.results;
            	var list = $("#results #content #ajaxResults #list");
            	list.html("");
            	var counter = 0;
            	$.each(items, function(key, val) {
                	//console.log(key+":"+val.name);
				   	$('#results #content #map').gmap('addMarker', { 'position': new google.maps.LatLng(val.longitude,val.latitude ), 'bounds': true ,'zoom':7 },function(map, marker){
					 $('#results #content #map').gmap('addInfoWindow', { 'position':marker.getPosition(), 'content': val.name }, function(iw) {
					                        $(marker).click(function() {
					                                iw.open(map, marker);
					                                map.panTo(marker.getPosition());
					                        });                                                                                                                                                                                                                               
					                });
				});
               		list.append('<li><a class="listClick" id="'+counter+'" data-url="details&ui-page=listview-1" data-transition="fade" ><img src="'+val.thumb+'"/><h3>'+val.name+'</h3></a></li>');
               		counter++;
            	});
            	$(".listClick").click(function(evt){
            		var data = ajaxObject[evt.currentTarget.id];
            		var htmlContent = '<h1>'+data.name+'</h1>';
            		var photos = data.photos;
            		var lPhotos = photos.length;
					htmlContent +='<div data-scroll="x">'
            		for(var i =0;i< lPhotos;i++)
            		{
						htmlContent +='<img class="gallery" src='+photos[i]+'   />'
            		}
					htmlContent +='</div>'
					htmlContent += '<h5>'+data.description+'</h5>';
            		htmlContent += '<p>Max capacity : '+data.capacity_max;
            		htmlContent += ' - Min capacity : '+data.capacity_min+'</p>';
            		htmlContent += '<div id="adress"><p>';
            		htmlContent += data.address.address+'<br />';
            		htmlContent += data.address.zip+' '+data.address.city+'<br />';
            		htmlContent += "</p></div>"
            		htmlContent += '<h5>'+data.price+' euros</h5>';
            		htmlContent += '<div><p>';
            		htmlContent += '<strong>Chambre/bed</strong><br />'
            		htmlContent += 'Nombre de chambre : '+data.room_number+'<br />';
            		htmlContent += 'Lit 2 places : '+data.two_person_bed +'<br />';
            		htmlContent += 'Lit enfant : '+data.child_bed +'<br />';
            		htmlContent += '</p></div>'
            		htmlContent += '<div><p>';
            		htmlContent += '<strong>Propri&eacute;taire/Owner</strong><br />'
           			htmlContent += data.owner.title+' '+data.owner.firstname+' '+data.owner.name;
            		htmlContent += data.owner.language+'<br />';
            		htmlContent += 'Phone: <a href="tel:'+data.owner.phone +'">'+data.owner.phone +'</a><br />';
            		htmlContent += 'Mobile: <a href="tel:'+data.owner.mobile +'">'+data.owner.mobile +'</a><br />';
            		htmlContent += 'Fax :<a href="tel:' +data.owner.fax+'">'+ data.owner.fax+'</a><br />';
            		htmlContent += 'Email : '+data.owner.email +'<br />';
            		htmlContent += 'www : '+data.owner.website +'<br />';
            		htmlContent += '</p></div>'
            		htmlContent += '<div><p>';
            		$("#details #content").html(htmlContent);
            		$("#details #content .gallery").hide();
            		$("#details #content .gallery").first().show();
            		$.mobile.changePage($("#details"));
            	});	
			list.listview('refresh');		
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