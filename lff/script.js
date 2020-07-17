var debug = true;

function LoadMyPlayers() {
  $(document).ready(function() {
                 
    var draft_file = "https://s3.ca-central-1.amazonaws.com/fantaisiefootball.p-o.ca/fantasiefootball_mock.csv";    
    var dominatorPlayers = [];
    var reqDominatorPlayers = $.get("rank_dominator.csv?q=" + Date.now(), function(txt) {
      var lines = txt.split("\n");
      for (var i = 1, len = lines.length - 1; i < len; i++) {
        var $line = lines[i];
        var $val = $line.split(",");

        var playername = $val[2].trim().slice(1, -1);
        var byeweek = $val[4].trim().slice(1, -1);
        dominatorPlayers[playername] = byeweek;
      }
    });

    $.when(reqDominatorPlayers).done(function() {      
      $.get(draft_file + "?now=" + Date.now(), function(txt) {
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
          var byeweek = dominatorPlayers[joueur];

          position = (position == "PK") ? "K" : position;
          position = (position == "TD") ? "DEF" : position;

          if (participant == "P-O Trudeau" || participant == "TRUDEAU") {
            if (joueur)
              $("#Rondes > tbody:last-child").append('<tr><td>' + choix + '</td><td>' + joueur + ' (' + byeweek + ')</td><td>' + position + '</td><td>' + equipeNFL + '</td></tr>');
            else
              $("#Rondes > tbody:last-child").append('<tr><td>' + choix + '</td><td></td><td></td><td></td></tr>');

            $("#val_pos_" + position).append(joueur + " (" + byeweek + ")<br>");
            $("#header_pos_" + position).html(position + " (" + $("#val_pos_" + position + " br").length + ")");
          }

          $('.thumbnails:empty').addClass('selected');
        }

        $("div[id^='val_pos_']").each(function(index) {
          if ($(this).html() == "") {
            $(this).html("<i>Aucun</i>");
          }          
        });

        $("#loader").hide();
        $("#content").show();
      });

      $("#nav_Team").addClass("active");

    });

  });

}

function loadPlayers() {
  $(document).ready(function() {
   
    var draft_file = "https://s3.ca-central-1.amazonaws.com/fantaisiefootball.p-o.ca/fantasiefootball_mock.csv";    
    var dominatorPlayers = [];
    var takenPlayers = [];
    var position = getParameterByName('pos')    
    var headerText = position;

    $("#header_position").html(headerText);
    $(document).prop('title', headerText);
    $("#nav_" + position).addClass("active");    
    var reqDominatorPlayers = $.get("rank_dominator.csv" + "?q=" + Date.now(), function(txt) {
      var lines = txt.split("\n");
      for (var i = 1, len = lines.length - 1; i < len; i++) {
        var $line = lines[i];
        var $val = $line.split(",");
        dominatorPlayers.push($val[2].trim().slice(1, -1));
      }
    });

    var reqTakenPlayer = $.get(draft_file, function(txt) {
      var lines = txt.split("\n");
      for (var i = 8, len = lines.length - 1; i < len; i++) {
        var $line = lines[i];
        var $val = $line.split(",");
        takenPlayers.push($val[3].trim());
      }
    });

    $.when(reqDominatorPlayers, reqTakenPlayer).done(function() {      
      $.get("rank_ffballers_" + position.toLowerCase() + ".csv?q=" + Date.now(), function(txt) {
        var lines = txt.split("\n");
        $("#Joueurs > tbody").empty();
        for (var i = 1, len = lines.length; i < len; i++) {
          var $line = lines[i];
          var $val = $line.split(",");

          if (position == "K") {
            var playername = $val[0].trim().slice(1);
            var byeweek = "";
            var consensus = $val[2].trim().slice(1, -1);
            var ah = $val[3].trim().slice(1, -1);
            var jm = $val[4].trim().slice(1, -1);
            var mw = $val[5].trim().slice(1, -1);
            playername = fixName(playername);
          } else if (position == "DEF") {
            var playername = $val[0].trim().slice(1, -1);
            var byeweek = "";
            var consensus = $val[1].trim().slice(1, -1);
            var ah = $val[2].trim().slice(1, -1);
            var jm = $val[3].trim().slice(1, -1);
            var mw = $val[4].trim().slice(1, -1);
            playername = fixName(playername);
          } else {
            var playername = $val[0].trim().slice(1, -1);
            var byeweek = playername.match(/\(\d{1,2}\)/g);
            var consensus = $val[1].trim().slice(1, -1);
            var ah = $val[2].trim().slice(1, -1);
            var jm = $val[3].trim().slice(1, -1);
            var mw = $val[4].trim().slice(1, -1);
            playername = playername.replace(/\W[A-Z]{2,3}(\W\(.{1,2}\))?/, "").trim();
            playername = fixName(playername);            
            byeweek = (byeweek == null) ? "(N/A)" : byeweek;
          }

          var trClass = "";
          if (takenPlayers.indexOf(playername) != -1)
            trClass = "success";
          if ((dominatorPlayers.indexOf(playername) == -1) && debug == true)
            trClass = "danger";

          $("#Joueurs > tbody:last-child").append('<tr class="' + trClass + '"><td>' + consensus + '</td><td>' + playername + '</td><td>' + ah + '</td><td>' + jm + '</td><td>' + mw + '</td></tr>');
        }

        $("#loader").hide();
        $("#content").show();
      });
    });
  });
}


function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function fixName(name) {
  var obj = {
    "name ff ballers": "name draft dominator",
    "Le'Veon Bell": "LeVeon Bell",
    "Odell Beckham Jr": "Odell Beckham",
    "Robert Kelley": "Rob Kelley",
    "D'Onta Foreman": "DOnta Foreman",
    "Devante Parker": "DeVante Parker",
    "Benjamin Watson": "Ben Watson",
    "Steven Hauschka": "Steve Hauschka",
    "Will Lutz": "Wil Lutz",
    "Mitch Trubisky": "Mitchell Trubisky",
    "AJ McCarron": "A.J. McCarron",
    "CJ Anderson": "C.J. Anderson",
    "TJ Yeldon": "T.J. Yeldon",
    "CJ Prosise": "C.J. Prosise",
    "Ted Ginn Jr": "Ted Ginn",
    "AJ Green": "A.J. Green",
    "Ronald Jones": "Ronald Jones II",
    "Benny Snell Jr.": "Benny Snell",
    "N'Keal Harry": "NKeal Harry",
    "Daesean Hamilton": "DaeSean Hamilton",
    "Tre'Quan Smith": "TreQuan Smith",
    "JJ Arcega-Whiteside": "J.J. Arcega-Whiteside",
    "OJ Howard": "O.J. Howard",
    "Chris Herndon NYJ (4)": "Chris Herndon",
    "Ka'imi Fairbairn": "Kaimi Fairbairn"
  };
  var correctedName = (obj[name]) ? obj[name] : name;
  return correctedName;
}