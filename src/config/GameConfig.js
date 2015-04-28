/**
 * Created by yuxinyu on 3/27.
 */

var SH = SH || {};

//game state
SH.GAME_STATE = {
    HOME:0,
    PLAY:1,
    OVER:2
};

//score
SH.SCORE = 0;
SH.DROP = 0;
SH.DIAMOND = 0;
SH.SPEEDUP_SORCE = [100, 250, 450, 700, 1000];

//sound
SH.SOUND = true;
SH.MUSIC = true;

//role
SH.ROLE = {
    BATMAN : 1,
    SUPERMAN: 2
};

SH.GROUND_HEIGHT = 124;
SH.HERO_START_X = 120;

if(typeof LayerTag == "undefined") {
    var LayerTag = {};
    LayerTag.background = 0;
    LayerTag.Animation = 1;
    LayerTag.GameLayer = 2;
    LayerTag.Status = 3;
}

// collision type for chipmunk
if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.hero = 0;
    SpriteTag.drop = 1;
    SpriteTag.dart = 2;
    SpriteTag.mud = 3;
}

