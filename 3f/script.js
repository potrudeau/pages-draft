function loadPlayers() {
  $(document).ready(function() {

    var reqQB = $.get("rank_qb.csv?q=" + Date.now(), function(txt) {
      var lines = txt.split("\n");
      for (var i = 1, len = lines.length - 1; i < len; i++) {
        var $line = lines[i];
        var $val = $line.split(",");
        var $joueur = ($val[0].trim() + " (" + $val[1].trim() + ")").replace(/\"/g, ""); 
        $("#QB > tbody:last-child").append('<tr><td>' + i + '</td><td>' + $joueur + '</td></tr>');
      }
    });
    
    var reqRB = $.get("rank_rb.csv?q=" + Date.now(), function(txt) {
      var lines = txt.split("\n");
      for (var i = 1, len = lines.length - 1; i < len; i++) {
        var $line = lines[i];
        var $val = $line.split(",");
        var $joueur = ($val[0].trim() + " (" + $val[1].trim() + ")").replace(/\"/g, ""); 
        $("#RB > tbody:last-child").append('<tr><td>' + i + '</td><td>' + $joueur + '</td></tr>');
      }
    });    
   
    var reqWR = $.get("rank_wr.csv?q=" + Date.now(), function(txt) {
      var lines = txt.split("\n");
      for (var i = 1, len = lines.length - 1; i < len; i++) {
        var $line = lines[i];
        var $val = $line.split(",");
        var $joueur = ($val[0].trim() + " (" + $val[1].trim() + ")").replace(/\"/g, ""); 
        $("#WR > tbody:last-child").append('<tr><td>' + i + '</td><td>' + $joueur + '</td></tr>');
      }
    });  
    
    var reqTE = $.get("rank_te.csv?q=" + Date.now(), function(txt) {
      var lines = txt.split("\n");
      for (var i = 1, len = lines.length - 1; i < len; i++) {
        var $line = lines[i];
        var $val = $line.split(",");
        var $joueur = ($val[0].trim() + " (" + $val[1].trim() + ")").replace(/\"/g, ""); 
        $("#TE > tbody:last-child").append('<tr><td>' + i + '</td><td>' + $joueur + '</td></tr>');
      }
    });    
    
    $.when(reqQB, reqRB, reqWR, reqTE).done(function() {      
      $.get("https://s3.ca-central-1.amazonaws.com/fantaisiefootball.p-o.ca/fff_mock.csv?q=" + Date.now(), function(txt) {
        var lines = txt.split("\n");
        for (var i = 8, len = lines.length; i < len; i++) {
          var $line = lines[i];
          var $val = $line.split(",");
          var $joueur = $val[3];
          
          if ($joueur)
          {
            console.log($joueur)
            $( "td:contains('" + $joueur + "')" )
              .css( "background-color", "#FFFF99" )
              .prev().css( "background-color", "#FFFF99" );            
          }
                    
         }
       });
    });
    
  });
}

function LoadMyPlayers() {
  $(document).ready(function() {
      $.get("https://s3.ca-central-1.amazonaws.com/fantaisiefootball.p-o.ca/fff_mock.csv" + "?now=" + Date.now(), function(txt) {
        $("#Rondes > tbody").empty();
        $("div[id^='val_pos_']").empty();
        var lines = txt.split("\n");
        for (var i = 9, len = lines.length - 1; i < len; i++) {
          var $line = lines[i];
          var $val = $line.split(",");

          var choix = $val[0].trim().slice(4, -3);
          var participant = $val[2].trim();
          var joueur = $val[3].trim();
          var position = $val[4].trim();
          var equipeNFL = $val[5].trim();

          position = (position == "PK") ? "K" : position;
          position = (position == "TD") ? "DEF" : position;

          if (participant == "P-O Trudeau" || participant == "TRUDEAU") {
            if (joueur)
              $("#Rondes > tbody:last-child").append('<tr><td>' + choix + '</td><td>' + joueur + '</td><td>' + position + '</td><td>' + equipeNFL + '</td></tr>');
            else
              $("#Rondes > tbody:last-child").append('<tr><td>' + choix + '</td><td></td><td></td><td></td></tr>');

            $("#val_pos_" + position).append(joueur + " (" + equipeNFL + ")<br>");
            $("#header_pos_" + position).html(position + " (" + $("#val_pos_" + position + " br").length + ")");
          }
        }
      });
  });
}