/**
 * Created by yuxinyu on 3/27.
 */

var SH = SH || {};

SH.SCALE = 0.8;
SH.MUD_Y = 1036;

//game state
SH.GAME_STATE = { HOME: 0, PLAY: 1, OVER: 2 };

//hero state
SH.HERO_STATE = { STOP: 0, JUMP: 1, FLY: 2, DIE: 3 };

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
SH.ROLE = SH.ROLE_NAME.BATMAN;

SH.GROUND_HEIGHT = 138;
SH.HERO_START_X = 240;

//Tag
SH.LAYER_TAG = {
    BACKGROUND : 50,
    ANIMATION : 51
};

// collision type for chipmunk
SH.SPRITE_TAG = {
    HERO:100,
    DROP:101,
    OTHER:102,
    SAND:104,
    ROCK:105
};