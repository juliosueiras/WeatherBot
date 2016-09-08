$(document).on('pagecreate',function(event){
  var items=[];
  var labels=[];
  var weathers=[];

  //gets current location on load
  if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(function(position){
      loadWeather(position.coords.latitude+','+position.coords.longitude);
    })
  }
  //loads some cities from JSON
  $.getJSON("city.json",function(data){
    $.each(data.cities,function(i,value){
    $('#sample').append('<li><a href="#" class="ui-btn">'+value.name+'</a></li>');
    })
    $('#sample>li').on('click',function(){
      var val=$(this).text();
      loadWeather(val,'');
    })

  });
  loadItem();

//get weather on click from  recent
    $('#mainList li').on('click',function(){
      var val=$(this).text();
      loadWeather(val,'');

  })

//Gets value from text field/gets Weather info and stores it in localStorage
  $('form').on('submit',function(event){
    var vals=$('#weather').val();
    var slipt =vals.split(',');
    event.preventDefault();
    for(var i=0;i<slipt.length;i++){
    $('#mainList').append('<li><a href="#">'+slipt[i]+'</a></li>');
    $('#mainList li').on('click',function(){
      var val=$(this).text();
      loadWeather(val,'');

    })
    items.push(slipt[i]);
    }
    localStorage.myItems=JSON.stringify(items);
    $('#mainList').listview('refresh');
    loadWeather(vals,'');
  });


//GPS locator
  $('.gps').click(function(){
    if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition(function(position){
        loadWeather(position.coords.latitude+','+position.coords.longitude);
      })
    }
  })
  $('#longw').on('click',function(){
       event.preventDefault();
  })

//Load cities from localStorage
function loadItem(){
    if(localStorage.myItems){
         items=JSON.parse(localStorage.myItems);
         items.forEach(function(item){
           $('#mainList').append('<li><a href="#">'+item+'</a></li>');
         });
         $('#mainList').listview('refresh');
       }

  }

//Main weather function which includes simpleWeather.js and canvas
function loadWeather(location,woeid){
    var html="";
    labels=[""];
    weathers=[""];
    $.simpleWeather({
        location:location,
        woeid:woeid,
        unit:'c',
        success:function(weather){
          city=weather.city;
          temp= '<img src=\'' + weather.thumbnail +'\'/>'+weather.temp+'\t'+weather.units.temp+'\t'+weather.currently;
          wcode='<p>'+weather.wcode+'</p>';
          wind='<p>Wind: '+weather.wind.speed +weather.units.speed+'</p>';
          humidity='<p>Humidity: '+weather.humidity+'%'+'</p>';
          $('.location').text(city);
          $('.temperature').html(temp);
          $('.climate_log').html(wind);
          $('.humidity').html(humidity);
          for(var i=0;i<weather.forecast.length;i++) {
          html += '<p>'+weather.forecast[i].day+': '+weather.forecast[i].high+'</p>';
          labels.push(weather.forecast[i].day);
          weathers.push(weather.forecast[i].high);

         }
         $('.forcast').html(html);

         var data = {
           labels: labels,
           datasets: [
        {
            label: "Weather Graph",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: weathers,
            spanGaps: false,
        }
    ]
};
var ctx = $("#myCanvas");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: data
});
labels=[""];
weathers=[""];
      },
        error:function(error){
          $('.error').html(error);
        }
      })
  }
});
