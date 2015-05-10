/**
 * Created by yuxinyu on 3/27.
 */

var SH = SH || {};

SH.SCALE = 0.8;
SH.MUD_Y = 1036;
SH.F_WIDTH = 1720;  //背景图1宽度
SH.B_WIDTH = 2276;  //背景图2宽度
SH.G_WIDTH = 1000;
SH.G_Y = -56;
SH.GROUND_HEIGHT = 184 + SH.G_Y;
SH.BRICK_HEIGHT = 450;
SH.HERO_START_X = 260;

SH.GAME_STATE = {HOME: 0, PLAY: 1, OVER: 2};
SH.MAP_TYPE = {BRICKS:0, FLAT: 1};

SH.HERO_STATE = {STOP: 0, JUMPUP: 1, JUMPDOWN: 2, FLY: 3, DIE: 4};
//animation
SH.BRICK_MOVE ={H:150, V:150};


//score
SH.SCORE = 0;
SH.DROP = 0;
SH.DIAMOND = 0;
SH.SPEEDUP_SORCE = [100, 250, 450, 700, 1000];

//sound
SH.SOUND = true;
SH.MUSIC = false;

//role
SH.ROLE_NAME = {
    BATMAN: 'batman',
    SUPERMAN: 'superman'
};
SH.ROLE = SH.ROLE_NAME.SUPERMAN;

//Tag
SH.LAYER_TAG = {
    BACKGROUND: 50,
    OBJECT: 51,
    ANIMATION: 52,
    STATUS: 53,
    PAUSE: 54,
    GAMEPLAY: 55
};

// collision type for chipmunk
SH.SPRITE_TAG = {
    HERO: 100,
    DROP: 101,
    OTHER: 102,
    SAND: 104,
    ROCK: 105
};