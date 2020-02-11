//function draw(cv,text,color,dataURL) {
function draw(cv,text,dataURL) {	
  console.log("cv "+cv);	
  console.log("text "+text);	
   console.log("dataURL "+dataURL);	
  var ctx = document.getElementById(cv).getContext('2d');
  ctx.font = '20px';
//  ctx.fillStyle=color;    // color of fill
//  ctx.fillRect(10, 40, 140, 160); // create rectangle  
  
var rectX = 50;
var rectY = 50;
var rectWidth = 200;
var rectHeight = 200;
var cornerRadius = 80;




  
  
  
  var myImg = new Image();
  myImg.onload = function() {
		ctx.drawImage(myImg, 0, 0,300,300);  
		//ctx.drawImage(myImg, 0, 0,400,500);  

	};
myImg.src = dataURL;
  
  
  
  
 // ctx.strokeText(text, 15, 50);
}
 function loadCanvas(dataURL) {
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');

        // load image from data url
        var imageObj = new Image();
        imageObj.onload = function() {
          context.drawImage(this, 0, 0);
        };

        imageObj.src = dataURL;
      }

function chooseDropDown(index) {
	//console.log(index);	

 
	
	$('#filter option')[index-1].selected = true;
	// console.log(text);	

 
//	var el = document.getElementsByTagName('select')[0]; 
	// assuming el is not null, select 4th option
//	el.selectedIndex = index;
	//console.log("changed "+$("#filter").find('option:selected').val());
	 $("[data-type='accordion-filter']").change();
	
	
	
	
	
//-------------
	
	
//----------------	

 
}




// URL-Parameter abfragen
    function getUrlParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
	

function replaceDummies(_details,_cookcoachid,_eventid,_thema){
	
	  var res = _details.replace("##cookcoachid##",_cookcoachid);
	  res = res.replace("##eventid##",_eventid);
	  res=res.replace("##thema##",_thema); 
	  return res;
}

function ajaxPost(myForm){
//var formData = $("#myform").serializeArray();
console.log("bin in ajaxPost(...)");
var formData = $(myForm).serializeArray();
var URL = $(myForm).attr("action");
$.post(URL,
    formData,
    function(data, textStatus, jqXHR)
    {
       console.log(data);    
    }).fail(function(jqXHR, textStatus, errorThrown) 
    {
 
    });

}	
	
var dataStore = "";
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


var gsheet = getUrlParameterByName('gsheet', window.location.href) || localStorage.getItem("gsheet");
//	console.log("gsheet "+gsheet);
//	localStorage.setItem('gsheet', gsheet);

$.ajax({
  type: 'GET',
  //    	  url: 'https://jodler.herokuapp.com/',
  //old url: 'http://localhost:3000/sheet1',

  // url: 'http://localhost:3000/2PACX-1vTKLd22vDKaau6S2nLYMo2BJAG0C_8Udv6QDbV5sL3NLIFhcvO10ICDFcOpOW0RXrBtPq87MV7Ak_cq',
//  url: 'http://localhost:3000/1WV-qIba3BuAVLdeGw7uDOtA6IGe4LVmDato_XAn1Hn4',
//  url: 'https://jodler.herokuapp.com/1WV-qIba3BuAVLdeGw7uDOtA6IGe4LVmDato_XAn1Hn4',

url: 'https://jodler.herokuapp.com/cook',

 // url: 'http://localhost:4000/cook',
  
//LOKAL	 url: 'http://localhost:3001/getentries',
//hier kommt sheet.best
  //url: 'https://sheet.best/api/sheet/fc2e6be0-adaf-4228-adce-279d0408c6c6',

  async: false,
  dataType: 'json',
  success: function (data) {
    dataStore = data;
    console.log(dataStore[0].thema);
  }
});

console.log("haha");

var test1 = '';
const mySet = new Set()


//Hack mit -1, da ein Leersatz mitkommt. JETZT NICHT MEHR NOTWENDIG
for (let i = 0; i < dataStore.length ; i++) {
  //var d = new Date(dataStore[i].Von);
  
  //Hack da cuba Datumswert so ausliefert
  // Von: 'Date(2019,8,27)',
 
// NUR WENN DATUM und CUBA 
//var d = eval("new "+dataStore[i].Von);


 // console.log(monthNames[d.getMonth()]);
  
//ohne Datum mit Bild:
//<script>loadCanvas("'+dataStore[i].Image +'");</script>
// test1 = test1 + '<div data-type="accordion-section" data-filter="' + dataStore[i].Kategorie + '"><div data-type="accordion-section-title"><div class="calendar-list-event col-md-12 clickable" data-reactid=".0.0.0.5.1:$0.0">			<div class="row" data-reactid=".0.0.0.5.1:$0.0.0">	<div class="col-sm-11 col-xs-10" data-reactid=".0.0.0.5.1:$0.0.0.1">		<div class="calendar-list-event__details calendar-list-event__details--with-thumbnail" data-reactid=".0.0.0.5.1:$0.0.0.1.1">						<div class="calendar-list-event__name" data-reactid=".0.0.0.5.1:$0.0.0.1.1.0">' + dataStore[i].Thema + '</div>							<div class="calendar-list-event__short-description" data-reactid=".0.0.0.5.1:$0.0.0.1.1.1">' + dataStore[i].Kategorie + '</div>						</div>					</div>				</div>			</div> 		</div>		<div  class="accordion-content" data-type="accordion-section-body">			<div class="calendar-event-details__description col-md-12" data-reactid=".0.0.0.5.1:$1.1.0.0.1">				<div class="calendar-event-details__description__title" data-reactid=".0.0.0.5.1:$1.1.0.0.1.0"></div>				<div  data-reactid=".0.0.0.5.1:$1.1.0.0.1.1"> ' + dataStore[i].Details + '  </div>									</div>								</div></div>';

  
//ohne Datum mit Rechteck:

//Alles in einer Zeile 
//test1 = test1 + '<div data-type="accordion-section" data-filter="' + dataStore[i].kategorie + '"><div data-type="accordion-section-title"><div class="calendar-list-event col-md-12 clickable" data-reactid=".0.0.0.5.1:$0.0">			<div class="row" data-reactid=".0.0.0.5.1:$0.0.0">	<div class="col-sm-11 col-xs-10" data-reactid=".0.0.0.5.1:$0.0.0.1">					<canvas class="calendar-list-event__image" id="DC'+i+'" width="300" height="350"></canvas> <script>draw("DC'+i+'","'+dataStore[i].kategorie +'","'+dataStore[i].image +'");</script>	<div class="calendar-list-event__details calendar-list-event__details--with-thumbnail" data-reactid=".0.0.0.5.1:$0.0.0.1.1">							<div class="calendar-list-event__name" data-reactid=".0.0.0.5.1:$0.0.0.1.1.0">' + dataStore[i].thema + '</div>							<div class="calendar-list-event__short-description" data-reactid=".0.0.0.5.1:$0.0.0.1.1.1">' + dataStore[i].kategorie + '</div>						</div>					</div>				</div>			</div> 		</div>		<div  class="accordion-content" data-type="accordion-section-body">			<div class="calendar-event-details__description col-md-12" data-reactid=".0.0.0.5.1:$1.1.0.0.1">				<div class="calendar-event-details__description__title" data-reactid=".0.0.0.5.1:$1.1.0.0.1.0"></div>				<div  data-reactid=".0.0.0.5.1:$1.1.0.0.1.1"> ' + dataStore[i].details + '  </div>									</div>								</div></div>';


//Alles in n Zeilen 
test1 = test1 + '<div data-type="accordion-section" data-filter="' 

test1 = test1 + dataStore[i].kategorie 
test1 = test1 + '"><div data-type="accordion-section-title"><div class="calendar-list-event col-md-12 clickable" data-reactid=".0.0.0.5.1:$0.0">			<div class="row" data-reactid=".0.0.0.5.1:$0.0.0">	<div class="col-sm-11 col-xs-10" data-reactid=".0.0.0.5.1:$0.0.0.1">					<canvas class="calendar-list-event__image" id="DC'+i+'" width="300" height="350"></canvas> <script>draw("DC'+i+'","'
test1 = test1 + dataStore[i].kategorie +'","'+dataStore[i].bildlink 
test1 = test1 + '");</script>	<div class="calendar-list-event__details calendar-list-event__details--with-thumbnail" data-reactid=".0.0.0.5.1:$0.0.0.1.1">							<div class="calendar-list-event__name" data-reactid=".0.0.0.5.1:$0.0.0.1.1.0">' 
test1 = test1 + dataStore[i].thema 
test1 = test1 + '</div>							<div class="calendar-list-event__short-description" data-reactid=".0.0.0.5.1:$0.0.0.1.1.1">' 
test1 = test1 + dataStore[i].kategorie + '</div>						</div>					</div>				</div>			</div> 		</div>		<div  class="accordion-content" data-type="accordion-section-body">			<div class="calendar-event-details__description col-md-12" data-reactid=".0.0.0.5.1:$1.1.0.0.1">				<div class="calendar-event-details__description__title" data-reactid=".0.0.0.5.1:$1.1.0.0.1.0"></div>				<div  data-reactid=".0.0.0.5.1:$1.1.0.0.1.1"> ' 
test1 = test1 + replaceDummies(dataStore[i].details, dataStore[i].cookcoachid,dataStore[i].eventid,dataStore[i].thema)
test1 = test1 + '  </div>									</div>								</div></div>';
 
 
 
 
 
 //mit Datum
//test1 = test1 + '<div data-type="accordion-section" data-filter="' + dataStore[i].Kategorie + '"><div data-type="accordion-section-title"><div class="calendar-list-event col-md-12 clickable" data-reactid=".0.0.0.5.1:$0.0">			<div class="row" data-reactid=".0.0.0.5.1:$0.0.0">				<div class="calendar-list-event__date col-xs-2 col-sm-1" data-reactid=".0.0.0.5.1:$0.0.0.0">					<div class="calendar-list-event__date__day" data-reactid=".0.0.0.5.1:$0.0.0.0.0">' + d.getDate() + '</div>					<div class="calendar-list-event__date__month" data-reactid=".0.0.0.5.1:$0.0.0.0.1">' + monthNames[d.getMonth()] + '</div>				</div>				<div class="col-sm-11 col-xs-10" data-reactid=".0.0.0.5.1:$0.0.0.1">					<canvas class="calendar-list-event__image" id="DC'+i+'" width="70" height="250"></canvas> <script>draw("DC'+i+'","'+dataStore[i].Kategorie +'","'+dataStore[i].Color +'");</script>	<div class="calendar-list-event__details calendar-list-event__details--with-thumbnail" data-reactid=".0.0.0.5.1:$0.0.0.1.1">							<div class="calendar-list-event__name" data-reactid=".0.0.0.5.1:$0.0.0.1.1.0">' + dataStore[i].Thema + '</div>							<div class="calendar-list-event__short-description" data-reactid=".0.0.0.5.1:$0.0.0.1.1.1">' + dataStore[i].Kategorie + '</div>						</div>					</div>				</div>			</div> 		</div>		<div  class="accordion-content" data-type="accordion-section-body">			<div class="calendar-event-details__description col-md-12" data-reactid=".0.0.0.5.1:$1.1.0.0.1">				<div class="calendar-event-details__description__title" data-reactid=".0.0.0.5.1:$1.1.0.0.1.0"></div>				<div  data-reactid=".0.0.0.5.1:$1.1.0.0.1.1"> ' + dataStore[i].Details + '  </div>									</div>								</div></div>';

 
 // test1 = test1 + '<div data-type="accordion-section" data-filter="' + dataStore[i].Kategorie + '"><div data-type="accordion-section-title"><div class="calendar-list-event col-md-12 clickable" data-reactid=".0.0.0.5.1:$0.0">			<div class="row" data-reactid=".0.0.0.5.1:$0.0.0">				<div class="calendar-list-event__date col-xs-2 col-sm-1" data-reactid=".0.0.0.5.1:$0.0.0.0">					<div class="calendar-list-event__date__day" data-reactid=".0.0.0.5.1:$0.0.0.0.0">' + d.getDate() + '</div>					<div class="calendar-list-event__date__month" data-reactid=".0.0.0.5.1:$0.0.0.0.1">' + monthNames[d.getMonth()] + '</div>				</div>				<div class="col-sm-11 col-xs-10" data-reactid=".0.0.0.5.1:$0.0.0.1">					<canvas class="calendar-list-event__image" id="DC'+i+'" width="70" height="250"></canvas> <script>draw("DC'+i+'","'+dataStore[i].Kategorie +'","'+dataStore[i].Color +'");</script>	<div class="calendar-list-event__details calendar-list-event__details--with-thumbnail" data-reactid=".0.0.0.5.1:$0.0.0.1.1">							<div class="calendar-list-event__name" data-reactid=".0.0.0.5.1:$0.0.0.1.1.0">' + dataStore[i].Thema + '</div>							<div class="calendar-list-event__short-description" data-reactid=".0.0.0.5.1:$0.0.0.1.1.1">' + dataStore[i].Kategorie + '</div>						</div>					</div>				</div>			</div> 		</div>		<div  class="accordion-content" data-type="accordion-section-body">			<div class="calendar-event-details__description col-md-12" data-reactid=".0.0.0.5.1:$1.1.0.0.1">				<div class="calendar-event-details__description__title" data-reactid=".0.0.0.5.1:$1.1.0.0.1.0">Hier Details</div>				<div  data-reactid=".0.0.0.5.1:$1.1.0.0.1.1"> ' + dataStore[i].Details + '  </div>									</div>								</div></div>';


 // test1 = test1 + '<div data-type="accordion-section" data-filter="' + dataStore[i].Kategorie + '"><div data-type="accordion-section-title"><div class="calendar-list-event col-md-12 clickable" data-reactid=".0.0.0.5.1:$0.0">			<div class="row" data-reactid=".0.0.0.5.1:$0.0.0">				<div class="calendar-list-event__date col-xs-2 col-sm-1" data-reactid=".0.0.0.5.1:$0.0.0.0">					<div class="calendar-list-event__date__day" data-reactid=".0.0.0.5.1:$0.0.0.0.0">' + d.getDate() + '</div>					<div class="calendar-list-event__date__month" data-reactid=".0.0.0.5.1:$0.0.0.0.1">' + monthNames[d.getMonth()] + '</div>				</div>				<div class="col-sm-11 col-xs-10" data-reactid=".0.0.0.5.1:$0.0.0.1">					<img class="calendar-list-event__image" src="' + dataStore[i].Image + '" data-reactid=".0.0.0.5.1:$1.0.0.1.0">	<div class="calendar-list-event__details calendar-list-event__details--with-thumbnail" data-reactid=".0.0.0.5.1:$0.0.0.1.1">							<div class="calendar-list-event__name" data-reactid=".0.0.0.5.1:$0.0.0.1.1.0">' + dataStore[i].Thema + '</div>							<div class="calendar-list-event__short-description" data-reactid=".0.0.0.5.1:$0.0.0.1.1.1">' + dataStore[i].Kategorie + '</div>						</div>					</div>				</div>			</div> 		</div>		<div  class="accordion-content" data-type="accordion-section-body">			<div class="calendar-event-details__description col-md-12" data-reactid=".0.0.0.5.1:$1.1.0.0.1">				<div class="calendar-event-details__description__title" data-reactid=".0.0.0.5.1:$1.1.0.0.1.0">Details</div>				<div  data-reactid=".0.0.0.5.1:$1.1.0.0.1.1"> ' + dataStore[i].Details + '  </div>									</div>								</div></div>';

  
  //Set befüllen
  mySet.add(dataStore[i].kategorie);
  }
// 2 Leerzeieln eingefügt. Eventuell wieder rausnehmen
 //test1 = test1 + '<div data-type="accordion-section" data-filter="' + "" + '"><div data-type="accordion-section-title"><div class="calendar-list-event col-md-12 clickable" data-reactid=".0.0.0.5.1:$0.0">			<div class="row" data-reactid=".0.0.0.5.1:$0.0.0">				<div class="calendar-list-event__date col-xs-2 col-sm-1" data-reactid=".0.0.0.5.1:$0.0.0.0">					<div class="calendar-list-event__date__day" data-reactid=".0.0.0.5.1:$0.0.0.0.0">' + "" + '</div>					<div class="calendar-list-event__date__month" data-reactid=".0.0.0.5.1:$0.0.0.0.1">' + "" + '</div>				</div>				<div class="col-sm-11 col-xs-10" data-reactid=".0.0.0.5.1:$0.0.0.1">					<canvas class="calendar-list-event__image" id="DC'+"A"+'" width="70" height="250"></canvas> <script></script>	<div class="calendar-list-event__details calendar-list-event__details--with-thumbnail" data-reactid=".0.0.0.5.1:$0.0.0.1.1">							<div class="calendar-list-event__name" data-reactid=".0.0.0.5.1:$0.0.0.1.1.0">' + "" + '</div>							<div class="calendar-list-event__short-description" data-reactid=".0.0.0.5.1:$0.0.0.1.1.1">' + "" + '</div>						</div>					</div>				</div>			</div> 		</div>		<div  class="accordion-content" data-type="accordion-section-body">			<div class="calendar-event-details__description col-md-12" data-reactid=".0.0.0.5.1:$1.1.0.0.1">				<div class="calendar-event-details__description__title" data-reactid=".0.0.0.5.1:$1.1.0.0.1.0">Details</div>				<div  data-reactid=".0.0.0.5.1:$1.1.0.0.1.1"> ' + "" + '  </div>									</div>								</div></div>';
 //test1 = test1 + '<div data-type="accordion-section" data-filter="' + "" + '"><div data-type="accordion-section-title"><div class="calendar-list-event col-md-12 clickable" data-reactid=".0.0.0.5.1:$0.0">			<div class="row" data-reactid=".0.0.0.5.1:$0.0.0">				<div class="calendar-list-event__date col-xs-2 col-sm-1" data-reactid=".0.0.0.5.1:$0.0.0.0">					<div class="calendar-list-event__date__day" data-reactid=".0.0.0.5.1:$0.0.0.0.0">' + "" + '</div>					<div class="calendar-list-event__date__month" data-reactid=".0.0.0.5.1:$0.0.0.0.1">' + "" + '</div>				</div>				<div class="col-sm-11 col-xs-10" data-reactid=".0.0.0.5.1:$0.0.0.1">					<canvas class="calendar-list-event__image" id="DC'+"B"+'" width="70" height="250"></canvas> <script></script>	<div class="calendar-list-event__details calendar-list-event__details--with-thumbnail" data-reactid=".0.0.0.5.1:$0.0.0.1.1">							<div class="calendar-list-event__name" data-reactid=".0.0.0.5.1:$0.0.0.1.1.0">' + "" + '</div>							<div class="calendar-list-event__short-description" data-reactid=".0.0.0.5.1:$0.0.0.1.1.1">' + "" + '</div>						</div>					</div>				</div>			</div> 		</div>		<div  class="accordion-content" data-type="accordion-section-body">			<div class="calendar-event-details__description col-md-12" data-reactid=".0.0.0.5.1:$1.1.0.0.1">				<div class="calendar-event-details__description__title" data-reactid=".0.0.0.5.1:$1.1.0.0.1.0">Details</div>				<div  data-reactid=".0.0.0.5.1:$1.1.0.0.1.1"> ' + "" + '  </div>									</div>								</div></div>';

//Aus dem Set ein sortierbares Array produzieren  
var sortedArray=  Array.from(mySet).sort();
  
//  for (const k of s.keys()) {
//	for (const k of sortedArray) {
//		console.log(k)
//}
//Dropdown befüllen

// counter=1 steht für all
var counter = 2;
$.each(sortedArray, function(val, text) {
		$('#filter').append( $('<option></option>').val(text).html(text) )
		
//		$('#ullinks').append( $('<li></li>').html('<a onclick="chooseDropDown(\''+counter+'\');" href="#'+text+'" >'+text+'</a>') )

		$('#ullinks').append( $('<li></li>').html('<a onclick="chooseDropDown('+counter+');" href="#'+text+'" >'+text+'</a>') )

		counter++;
		}); 





test2 = '';

