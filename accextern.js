var dataStore = "";
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

$.ajax({
  type: 'GET',
  //    	  url: 'https://jodler.herokuapp.com/',
  //old url: 'http://localhost:3000/sheet1',

  // url: 'http://localhost:3000/2PACX-1vTKLd22vDKaau6S2nLYMo2BJAG0C_8Udv6QDbV5sL3NLIFhcvO10ICDFcOpOW0RXrBtPq87MV7Ak_cq',
//  url: 'http://localhost:3000/1WV-qIba3BuAVLdeGw7uDOtA6IGe4LVmDato_XAn1Hn4',
    url: 'https://jodler.herokuapp.com/1WV-qIba3BuAVLdeGw7uDOtA6IGe4LVmDato_XAn1Hn4',
//hier kommt sheet.best
  //url: 'https://sheet.best/api/sheet/fc2e6be0-adaf-4228-adce-279d0408c6c6',

  async: false,
  dataType: 'json',
  success: function (data) {
    dataStore = data;
    console.log(dataStore[0].Thema);
  }
});

console.log("haha");

var test1 = '';

//Hack mit -1, da ein Leersatz mitkommt. JETZT NICHT MEHR NOTWENDIG
for (let i = 0; i < dataStore.length ; i++) {
  //var d = new Date(dataStore[i].Von);
  
  //Hack da cuba Datumswert so ausliefert
  // Von: 'Date(2019,8,27)',
  var d = eval("new "+dataStore[i].Von);
  console.log(monthNames[d.getMonth()]);
  test1 = test1 + '<div data-type="accordion-section" data-filter="' + dataStore[i].Kategorie + '"><div data-type="accordion-section-title"><div class="calendar-list-event col-md-12 clickable" data-reactid=".0.0.0.5.1:$0.0">			<div class="row" data-reactid=".0.0.0.5.1:$0.0.0">				<div class="calendar-list-event__date col-xs-2 col-sm-1" data-reactid=".0.0.0.5.1:$0.0.0.0">					<div class="calendar-list-event__date__day" data-reactid=".0.0.0.5.1:$0.0.0.0.0">' + d.getDate() + '</div>					<div class="calendar-list-event__date__month" data-reactid=".0.0.0.5.1:$0.0.0.0.1">' + monthNames[d.getMonth()] + '</div>				</div>				<div class="col-sm-11 col-xs-10" data-reactid=".0.0.0.5.1:$0.0.0.1">					<img class="calendar-list-event__image" src="' + dataStore[i].Image + '" data-reactid=".0.0.0.5.1:$1.0.0.1.0">	<div class="calendar-list-event__details calendar-list-event__details--with-thumbnail" data-reactid=".0.0.0.5.1:$0.0.0.1.1">							<div class="calendar-list-event__name" data-reactid=".0.0.0.5.1:$0.0.0.1.1.0">' + dataStore[i].Thema + '</div>							<div class="calendar-list-event__short-description" data-reactid=".0.0.0.5.1:$0.0.0.1.1.1">' + dataStore[i].Kategorie + '</div>						</div>					</div>				</div>			</div> 		</div>		<div  class="accordion-content" data-type="accordion-section-body">			<div class="calendar-event-details__description col-md-12" data-reactid=".0.0.0.5.1:$1.1.0.0.1">				<div class="calendar-event-details__description__title" data-reactid=".0.0.0.5.1:$1.1.0.0.1.0">Details</div>				<div  data-reactid=".0.0.0.5.1:$1.1.0.0.1.1"> ' + dataStore[i].Details + '  </div>									</div>								</div></div>';
}

test2 = '';

