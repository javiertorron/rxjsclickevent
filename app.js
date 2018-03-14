var button = document.querySelectorAll('.this');
var clickStream = Rx.Observable.fromEvent(button, 'click');
var documentStream = Rx.Observable.fromEvent(document, 'click');
var selectedControl = '';
var number = '';

var whereStream = documentStream
	.buffer(function() { return documentStream.throttle(250); })
  .filter(function(event) { return event; });
  
var multiClickStream = clickStream
    .buffer(function() { return clickStream.throttle(250); })
    .map(function(list) { return list.length; })
    .filter(function(x) { return x >= 2; });
    
var singleClickStream = clickStream
    .buffer(function() { return clickStream.throttle(250); })
    .map(function(list) { return list.length; })
    .filter(function(x) { return x === 1; });
    
singleClickStream.subscribe(function (event) {
    number = 'Click on ';
    document.querySelector('h5').textContent = 'One click';
});

multiClickStream.subscribe(function (numclicks) {
    number = 'Multiple clicks ('+numclicks+') on ';
    document.querySelector('h5').textContent = ''+numclicks+'x clicked';
});

whereStream.subscribe(function (event) {
    selectedControl = event[0].target.text;
    if(selectedControl === undefined) { 
    	number = 'Where have you clicked? Are you sure that is a control?';
      selectedControl = '';
    }
    if(number)
	    document.querySelector('h2').textContent = number + selectedControl;
});

Rx.Observable.merge(singleClickStream, multiClickStream, documentStream)
    .throttle(2500)
    .subscribe(function (suggestion) {
    		number = '';
        document.querySelector('h2').textContent = 'Take your action';
        document.querySelector('h5').textContent = 'Here you\'ll see how many times you clicked';
    });

