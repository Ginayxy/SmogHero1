/**
 * Created by yuxinyu_91 on 4/24.
 */

var GamePlayLayer = cc.Layer.extend({

    _tmpScore:0,
    _state:null,

    ctor: function () {
        this._super();
        this.init();
        this.playMusic();
    },
    init: function(){
        size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(res.MMBg_plist);
        cc.spriteFrameCache.addSpriteFrames(res.MMButtons_plist);
        cc.spriteFrameCache.addSpriteFrames(res.Role_plist);

        // 重置全局变量
        SH.SCORE = 0;
        this._state = SH.GAME_STATE.PLAY;

        //背景层
        var bg = new cc.LayerGradient(cc.color(246, 237, 213), cc.color(196, 196, 196), cc.p(0, 1));
        bg.ignoreAnchorPointForPosition(false);
        bg.attr({x: size.width / 2, y: size.height / 2, anchorX: 0.5, anchorY: 0.5});
        bg.changeWidth(800);
        bg.changeHeight(1136);
        this.addChild(bg);


    },

    playMusic: function(){
        if(SH.MUSIC){
            var audioEngine = cc.audioEngine;
            audioEngine.playMusic(sound_res.Play_music, true);
        }
    }
});

var GamePlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GamePlayLayer();
        this.addChild(layer);
    }
});