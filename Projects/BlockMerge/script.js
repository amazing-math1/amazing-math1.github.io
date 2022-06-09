var board = document.getElementById("board");
var points_count = document.getElementById("points_count");
var final_score = document.getElementById("final_score");
var high_score = document.getElementById("max_score");
var finalScreen = document.getElementById("FinalScreen");

var boardArray = new Array(0);

function GetBoard() { return boardArray; }

setInterval(function() {
  points_count.innerText = points;
}, 10);

CreateBoard();

function CreateBoard() {
  var board_Index = 0;

  for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 10; y++) {
      AddTile(board, x, y);
      let id = Math.ceil(Math.random() * 5);
      let color = "gray";
      if (id == 1)
        color = "yellow";
      else if (id == 2)
        color = "green";
      else if (id == 3)
        color = "blue";
      else if (id == 4)
        color = "red";
      else if (id == 5)
        color = "purple";
      SetTile(x, y, color);

      boardArray[board_Index] = color;
      board_Index++;
    }
  }
}

var points = 0;
var highScore = localStorage.getItem("highscore");
high_score.innerText = highScore;

function AddTile(tile_holder, x, y) {
  let id = x + "|" + y;
  tile_holder.innerHTML += "<div id='" + id + "' class='tile' onmouseleave='LeaveTile(" + x + ", " + y + ")' onmouseover='HoverTile(" + x + ", " + y + ")' onclick='ClickTile(" + x + ", " + y + ")'></div>";
}

function LeaveTile(x, y) {
  if (!propergate_in_progress)
    UnprogradeHover(x, y);
}

function HoverTile(x, y) {
  PropogateHover(x, y);
}
function DoXYThing(x, y, id) {
  if (GetId(x, y) == id && !GetClassList(x, y).contains("hover"))
    PropogateHover(x, y);
}

var propergate_in_progress = false;

function PropogateHover(x, y) {
  var currentIdTihngEpicCool = GetId(x, y);

  GetClassList(x, y).add("hover");

  DoXYThing(x + 1, y, GetId(x, y));
  DoXYThing(x - 1, y, GetId(x, y));
  DoXYThing(x, y + 1, GetId(x, y));
  DoXYThing(x, y - 1, GetId(x, y));
}

function DoXYThingU(x, y, id) {
  if (x >= 0 && x < 10 && y >= 0 && y < 10) {
    if (GetClassList(x, y).contains("hover") && id == GetId(x, y))
      UnprogradeHover(x, y);
  }
}

function UnprogradeHover(x, y) {
  GetClassList(x, y).remove("hover");

  DoXYThingU(x + 1, y, GetId(x, y));
  DoXYThingU(x - 1, y, GetId(x, y));
  DoXYThingU(x, y + 1, GetId(x, y));
  DoXYThingU(x, y - 1, GetId(x, y));
}

function HiglightTile(x, y) {
  GetClassList(x, y).add("highlight");
  setTimeout(function() {
    GetClassList(x, y).remove("highlight");
  }, 500)
}

var in_movedown = false;
var moveovercallcount = 0;

function ClickTile(x, y) {
  if (!in_movedown) {
    in_movedown = true;
    let oldTile = GetId(x, y);
    var more_than_1 = DoSurrounding(x, y, oldTile, 1);
    if (more_than_1) {
      in_movedown = false;
      ResetTile(x, y);
      setTimeout(function() {
        if (x > 0) {
          MoveTilesDown();

          while (FindGray())
            MoveTilesDown();
        }
        setTimeout(function() {
          moveovercallcount = 0;
          MoveTilesOver();
          FindTilesLeft();
        }, 100);
      }, 500);
    } else {
      in_movedown = false;
    }
  }
}

var min_y = 8;

function FindTilesLeft() {
  for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 10; y++) {
      let currentId = GetId(x, y);
      if (currentId != "test") {
        let idup = GetId(x + 1, y);
        let idright = GetId(x, y + 1);
        let iddown = GetId(x - 1, y);
        let idleft = GetId(x, y - 1);

        if (idup == currentId || idright == currentId || iddown == currentId || idleft == currentId)
          return;
      }
    }
  }
  finalScreen.classList.add("Show");
  points_display.classList.add("Hide");
  final_score.innerText = points;
  if (points > highScore) {
    highScore = points;
    high_score.innerText = highScore;
    localStorage.setItem("highscore", highScore);
  }
}

function MoveTilesOver() {
  moveovercallcount++;
  if (moveovercallcount > 20)
    return;
  var found_row = false;

  var not_full_row_count = 0;

  // for (var y2 = 0; y2 < 10; y2++) {
  //   HiglightTile(y2, 9);
  // }

  for (var y2 = 0; y2 < 10; y2++) {
    for (var x2 = 0; x2 < 10; x2++) {
      if (GetId(x2, y2) != "test") {
          not_full_row_count++;
          break;
      }
    }
  }

  //not_full_row_count -= 1;

  for (var y = not_full_row_count; y >= 0; y--) {
    var isEmpty = true;
    for (var x = 0; x < 10; x++) {
      if (GetId(x, y) != "test") {
          isEmpty = false;
          break;
      }
    }
    if (isEmpty) {
      for (var x = 0; x < 10; x++) {
        ResetTile(x, y);
        GetClassList(x, y).remove("gray");
        if (y + 1 < 10) {
          SetTile(x, y, GetId(x, y + 1));
          ResetTile(x, y + 1);
          GetClassList(x, y + 1).remove("gray");
          GetClassList(x, y + 1).add("test");
        } else {
          SetTile(x, y, "test");
        }
      }
      MoveTilesOver();
      found_row = true;
      break;
    }
  }
  return found_row;
}

function FindGray() {
  for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 10; y++) {
      if (GetId(x, y) == "gray")
        return true;
    }
  }
  return false;
}
function MoveTilesDown() {
  let xPos = -1;
  for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 10; y++) {
      let tile = GetId(x, y);
      if (tile == "gray" && xPos == -1)
        xPos = x;
    }
  }

  for (let y = 0; y < 10; y++) {
    if (GetId(xPos, y) == "gray") {
      GetClassList(xPos, y).remove("gray");
      if (xPos > 0) {
        GetClassList(xPos, y).add(GetId(xPos - 1, y));
        GetClassList(xPos - 1, y).remove(GetId(xPos - 1, y));
        GetClassList(xPos - 1, y).add("gray");
      } else {
        GetClassList(xPos, y).remove(GetId(xPos, y));
        GetClassList(xPos, y).add("test");
      }
    }
  }
}
function GetClassList(x, y) {
  if (x < 0 && x > 9 && y < 0 && y > 9)
    return null;
  return document.getElementById(x + "|" + y).classList;
}
function DoSurrounding(x, y, oldTile, index) {
  if (oldTile != "test") {
    let s1 = GetId(x - 1, y);
    var did = false;
    if (s1 == oldTile) {
      ResetTile(x - 1, y);
      DoSurrounding(x - 1, y, s1, index + 1);
      points += index;
      did = true;
    }

    let s2 = GetId(x, y - 1);
    if (s2 == oldTile) {
      ResetTile(x, y - 1);
      DoSurrounding(x, y - 1, s2, index + 1);
      points += index;
      did = true;
    }

    let s3 = GetId(x + 1, y);
    if (s3 == oldTile) {
      ResetTile(x + 1, y);
      DoSurrounding(x + 1, y, s3, index + 1);
      points += index;
      did = true;
    }

    let s4 = GetId(x, y + 1);
    if (s4 == oldTile) {
      ResetTile(x, y + 1);
      DoSurrounding(x, y + 1, s4, index + 1);
      points += index;
      did = true;
    }
  }
  return did;
}
function ResetTile(x, y) {
  let id = x + "|" + y;
  let object = document.getElementById(id);
  if (object != null) {
    object.classList = "tile";
    object.classList.add("gray");
  }
}
function GetId(x, y) {
  let classLista = document.getElementById(x + "|" + y);
  if (classLista != null) {
    let classList = classLista.classList;
    if (classList.contains("yellow"))
      return "yellow";
    else if (classList.contains("green"))
      return "green";
    else if (classList.contains("blue"))
      return "blue";
    else if (classList.contains("red"))
      return "red";
    else if (classList.contains("purple"))
      return "purple";
    else if (classList.contains("test"))
      return "test";
  }
  return "gray";
}
function SetTile(x, y, type) {
  document.getElementById(x + "|" + y).classList.add(type);
}

function RestartGame() {
  var indexdsasda2 = 0;
  for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 10; y++) {
        let id = Math.ceil(Math.random() * 5);
        let color = "gray";
        if (id == 1)
          color = "yellow";
        else if (id == 2)
          color = "green";
        else if (id == 3)
          color = "blue";
        else if (id == 4)
          color = "red";
        else if (id == 5)
          color = "purple";

        boardArray[indexdsasda2] = color;
        indexdsasda2++;
    }
  }
  finalScreen.classList.remove("Show");
  points_display.classList.remove("Hide");
}
function ResetGame() {
  var indexdsasda = 0;
  min_y = 8;
  points = 0;
  for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 10; y++) {
      ResetTile(x, y);
      GetClassList(x, y).remove("gray");
      SetTile(x, y, boardArray[indexdsasda]);
      indexdsasda++;
    }
  }
}
