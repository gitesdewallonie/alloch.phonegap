var zoomGlobal = 9;
var ajaxURL = "http://www.allochambredhotes.be/getMobileClosestHebs";
var watchID = null;
var geolocation = null;
var isGeolocated = false;
var isTextSearch = false;
var utf8adresse ;
var giteLon,giteLat;
var myLatitude;
var myLongitude;
var mapPoints;
var fromHomePage= true;
var isGeolocPossible = false;
function onBodyLoad()
{		

	document.addEventListener("deviceready", onDeviceReady, false);

}


/*function onResume() {
	$.mobile.changePage($("#home"));
}
*/
function onDeviceReady()
{
 		var options = { frequency: 3000 };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
		//Quand vous ne checker pas sur le device commenter le checkConnectivity
		checkConnectivity();
}

function checkConnectivity()
{
	var isOnline = false;

	var networkState = network.connection.type;
	if (networkState != "none") 
	{
		isOnline = true;
	} else {
		 switch (language)
	    {
	        case "en":
	         	alert("There's no access to internet, this app needs a connection");
	        break;
	        case "fr":
	          alert("Vous n'êtes pas connecté à Internet.  Cette application doit se connecter.");
	        break;
	        case "nl":
	          	alert("Er is geen toegang tot internet. Voor deze applicatie is een verbinding met internet nodig.");
	         break;
	    }
	
	
		navigator.app.exitApp();
	  isOnline = false; 
	}

}

//GEOLOC START
var onSuccess = function(position) {

	isGeolocPossible = true;
	if(isGeolocated){
	//console.log("onSuccess 1");
		getResults(position.coords.latitude+','+position.coords.longitude);
	} else
	{
		//console.log("onSuccess 2");
			navigator.geolocation.clearWatch(watchID);
			geolocation = position;
			isGeolocated = true;
	}
};	

// onError Callback receives a PositionError object
function onError(error) {
   //alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
	 switch (language)
    {
        case "en":
         alert("Please authorize the use of your GPS system for this application to be operational.");
        break;
        case "fr":
          alert("Vous devez autoriser l'utilisation de votre gps pour que cette application soit opérationnelle.");
        break;
        case "nl":
          alert("U moet het gebruik van uw gps toestaan om deze applicatie in werking te stellen.");
         break;
    }

}
//GEOLOC STOP

function clickIListHandler(evt)
{
	var data = ajaxObject[evt.currentTarget.id];
	var listHtml ='<ul data-role="listview" id="listeChambres" data-inset="true">';
	var list = $("#resultsListe #content #listeChambres");
	for(var i = 0;i<data.length;i++)
	{
		listHtml+=('<li><a class="listClick" id="'+evt.currentTarget.id+'_'+i+'" data-url="details&ui-page=listview-1" ><img src="'+data[i].thumb+'"/><h3>'+data[i].name+'</h3></a></li>');
	}
	listHtml+='</ul>';
	$("#resultsListe #header #titre").html(data[0].name);
	$("#resultsListe #content").html(listHtml);
	$("#resultsListe #content #listeChambres .listClick").bind({click:function(e){clickHandler(e)}});
	$.mobile.changePage($("#resultsListe"));
	$("#resultsListe").trigger('create');
}


function clickItineraireHandler(evt,args)
{
	giteLat = args.latitude;
	giteLon = args.longitude;
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
		one_person_bed : data.one_person_bed,
		distribution : data.distribution,
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
	
	if(tplData.one_person_bed ==0){
		tplData.asonepersonbed= false;
	} else {
		tplData.asonepersonbed= true;
	}
	
	if(tplData.two_person_bed ==0){
		tplData.astwopersonbed= false;
	} else {
		tplData.astwopersonbed= true;
	}
	
	detailTpl=ich.detailTpl(tplData);
	$("#details #header .titre").html(data.name);
	$("#details #content").html(detailTpl);

	$("#details #content .itineraireClick").bind({click:function(e){clickItineraireHandler(e,{ longitude: data.longitude,latitude : data.latitude })}});
	$('#details #content .pix_diapo').diapo();	
	$.mobile.changePage($("#details"));
}

function setMap(values)
{
	$("#results #content #map").gmap();
    if ($("#results #content #map").gmap('getMarkers').length > 0) {
        $("#results #content #map").gmap('destroy');
    }
	$("#results #content #map").gmap({'zoom':zoomGlobal,'disableDefaultUI':false,'streetViewControl':false,'mapTypeControl':false,'navigationControl':true,'callback': function(){
        var counter = 0;
        var link = "";
        var infoValue = "";
        $.each(values, function(index, val) {
			if(val.list){
            	link = '<a class="ilistClick" id="'+counter+'"';
			} else 
			{
				  link = '<a class="listClick" id="'+counter+'"';
			}		
	        infoValue = link+'><h5>'+ val.name + ' '+val.capacity_min+' p. <br/>'+val.address.town+'</h5></a>';
			$('#results #content #map').gmap('addMarker', { 'position': new google.maps.LatLng(val.longitude,val.latitude ),'bounds':true},function(map, marker){
				$('#results #content #map').gmap('addInfoWindow', { 'position':marker.getPosition(), 'content': infoValue }, function(iw) {
					$(marker).click(function() {
						iw.open(map, marker);
						map.panTo(marker.getPosition());
						$("#results #content #map .listClick").bind({click:function(e){clickHandler(e)}});
						$("#results #content #map .ilistClick").bind({click:function(e){clickIListHandler(e)}});
						$("#results #content #map .listClick").bind({click:function(e){
							iw.close();
						}});
						$("#results #content #map .ilistClick").bind({click:function(e){
							iw.close();
						}});						
					});                                                                                                                                                                                                                               
				});
			});
            counter++;
        })	
  }});
$.mobile.hidePageLoadingMsg();
}
function getResults(address)
{
	$.mobile.showPageLoadingMsg();
	console.log(address);
	utf8adresse = address;
	if(fromHomePage)
	{
		
		$("#results #content #ajaxResults #list").html("");
		//console.log("getResults 1");
		$.support.cors = true;
		$.getJSON(ajaxURL+"?LANGUAGE="+language+"&address="+address, {}, 
        function(data,textStatus) 
		{		
				//console.log("getResults 1 getJSON");
				if(textStatus!='success')
				{
					alert("Il y a un soucis de connection au serveur")
				}
            	ajaxObject = data.results;
            	var items = data.results;
            	var list = $("#results #content #ajaxResults #list");
            	list.html("");
            	var counter = 0;
                mapPoints = [];
            	$.each(items, function(key, val) {
					if(!$.isArray(items[key])){
		                list.append('<li><a class="listClick" id="'+counter+'" ><img src="'+val.thumb+'"/><h3>'+val.name+'</h3></a></li>');
						val.list = false;
                        mapPoints.push(val);
					} else
					{
		                list.append('<li><a class="ilistClick" id="'+counter+'"><img src="'+val[0].thumb+'"/><h3>'+val[0].name+'</h3></a><span class="ui-li-count">'+val.length+'</span></li>');
						value = val[0];
						value.list = true;
                        mapPoints.push(value);
					}
					counter++;
				});
                setMap(mapPoints);
				$(".listClick").bind({click:function(e){clickHandler(e)}});
				$(".ilistClick").bind({click:function(e){clickIListHandler(e)}});
			list.listview('refresh');
			$.mobile.hidePageLoadingMsg();
    });
	} else
	{
		console.log("getResults 2");
			var items = ajaxObject;
        	var list = $("#results #content #ajaxResults #list");
        	list.html("");
        	var counter = 0;
            mapPoints = [];
        	$.each(items, function(key, val) {
				if(!$.isArray(items[key])){
	                list.append('<li><a class="listClick" id="'+counter+'" ><img src="'+val.thumb+'"/><h3>'+val.name+'</h3></a></li>');
					val.list = false;
                    mapPoints.push(val);
				} else
				{
	                list.append('<li><a class="ilistClick" id="'+counter+'"><img src="'+val[0].thumb+'"/><h3>'+val[0].name+'</h3></a><span class="ui-li-count">'+val.length+'</span></li>');
					value = val[0];
					value.list = true;
                    mapPoints.push(value);
				}
				counter++;
			});
            setMap(mapPoints);
			$(".listClick").bind({click:function(e){clickHandler(e)}});
			$(".ilistClick").bind({click:function(e){clickIListHandler(e)}});
			list.listview('refresh');
			$.mobile.hidePageLoadingMsg();
	}
	$('#results').trigger('create');

}

function itinerairePageUpdate(event)
{
		$.mobile.showPageLoadingMsg();
	$("#itineraire #content #map").gmap({'disableDefaultUI':true,'mapTypeControl':false,'streetViewControl':false,'navigationControl':true, 'callback': function() {
		if(isTextSearch)
		{
	        utf8adresse = utf8adresse + ', Belgique';
			$('#itineraire #content #map').gmap('displayDirections', { 'origin': utf8adresse, 'destination': new google.maps.LatLng(giteLon, giteLat ), 'travelMode': google.maps.DirectionsTravelMode.DRIVING, 'unitSystem': google.maps.UnitSystem.METRIC },{ 'panel': document.getElementById('directions')}, function(success, result) {
					if ( success ){	} else{alert("Data not received")}     
				});
		}
		else
		  {
				navigator.geolocation.getCurrentPosition(function(position)
				{
					myLatitude = position.coords.latitude;
					myLongitude = position.coords.longitude;
					$('#itineraire #content #map').gmap('displayDirections', { 'origin': new google.maps.LatLng(myLatitude,myLongitude), 'destination': new google.maps.LatLng(giteLon, giteLat ), 'travelMode': google.maps.DirectionsTravelMode.DRIVING, 'unitSystem': google.maps.UnitSystem.METRIC },{ 'panel': document.getElementById('directions')}, function(success, result) {
						if ( success ){} else{alert("Data not received")}     
					});
				});
			}
		}});
		$.mobile.hidePageLoadingMsg();
}

$(document).ready(function() {
		//pour tester en local il faut appeler le ondevoce ici
		//onDeviceReady();
		var ajaxObject;
		$("#geoLocalise").click(function(e) {
			e.preventDefault();	
			if(isGeolocPossible)
			{
				if(isGeolocated)
				{
					navigator.geolocation.getCurrentPosition(onSuccess, onError);
				} else{     
					utf8adresse =  geolocation.coords.latitude+','+geolocation.coords.longitude       
					getResults(utf8adresse,true);
				}
				$.mobile.changePage($("#results"));
			}
			else{
				onError();
			}	
          });
		$('#searchClick').click(function(e) {
			e.preventDefault();
			utf8adresse = unescape( encodeURIComponent( $('#addresse').val()) );
            if (utf8adresse == "") {
                alert('Vous devez rentrer une adresse ...')
                return false;
		    }
			isTextSearch = true;
		    getResults(utf8adresse,true);
		});
		$('.onEnterSearch').keypress(function(evt) {
		    if(evt.keyCode === 13){
		        if(this.value != "") {
					evt.preventDefault();
					utf8adresse = unescape( encodeURIComponent( $('#addresse').val()) );
					$.mobile.changePage($("#results"));
					getResults(utf8adresse,true);
					isTextSearch = true;
				}
		        return false;
		    }
			
		    return true;
		});

});
$(document).bind("mobileinit", function(){
	$.mobile.defaultPageTransition = 'fade';
	$.mobile.allowCrossDomainPages = true;
	$('#itineraire').live('pageshow',function(event){
		$('#itineraire #content').html("");
		$('#itineraire #content').html('<div id="map" class="map"></div><div id="directions"></div>');
		fromHomePage=false;
		itinerairePageUpdate(event);
		
	});
	$('#results').live('pageshow',function(event){
	//	if(!fromHomePage)
	//	{
			getResults(utf8adresse);
	//	}
	});
	$('#home').live('pageshow',function(event){
		isTextSearch = false;
		utf8adresse = '';
		fromHomePage = true;
	});
});
