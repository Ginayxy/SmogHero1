var StatusLayer = cc.Layer.extend({

    _tmpScore: 0,
    _score_txt: null,
    _best_txt: null,
    pause_menu:null,

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this._super();
        size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(res.Obj_plist);

        // 状态层
        var pause_btn = new cc.MenuItemImage('#icon_pause.png', '#icon_pause_n.png', this.onPause, this);
        pause_btn.attr({x: 100, y: SH.MUD_Y, scale: SH.SCALE});
        this.pause_menu = new cc.Menu(pause_btn);
        this.pause_menu.setPosition(0, 0);
        this.addChild(this.pause_menu);

        var drop_icon = new cc.Sprite("#icon_drops_n.png");
        drop_icon.attr({x: size.width - 230, y: SH.MUD_Y, scale: SH.SCALE});
        this.addChild(drop_icon);
        this._score_txt = new cc.LabelBMFont("0", res.charmap_fnt);
        this._score_txt.attr({
            x: size.width - 75,
            y: SH.MUD_Y,
            anchorX: 1,
            anchorY: 0.1,
            scale: SH.SCALE,
            color: cc.color(255, 255, 255)
        });
        this.addChild(this._score_txt);
        this._best_txt = new cc.LabelBMFont("BEST: " + SH.SCORE, res.charmap_fnt);
        this._best_txt.attr({
            x: size.width - 75,
            y: SH.MUD_Y - 22,
            anchorX: 1,
            anchorY: 1,
            scale: 0.3,
            color: cc.color(255, 255, 255)
        });
        this.addChild(this._best_txt);

        this.scheduleUpdate();
    },
    update: function () {
        // 更新分数
        if (SH.STATE == SH.GAME_STATE.PLAY) {
            this.updateUI();
        }
    },

    onPause: function(event){
        var audioEngine = cc.audioEngine;
        if(SH.SOUND){
            audioEngine.playEffect(sound_res.Click_eff);
        }
        if(SH.MUSIC && audioEngine.isMusicPlaying()){
            audioEngine.pauseMusic();
        }
        this.getParent().getChildByTag(SH.LAYER_TAG.GAMEPLAY).getChildByTag(SH.LAYER_TAG.ANIMATION).pause();
        this.getParent().getChildByTag(SH.LAYER_TAG.GAMEPLAY).getChildByTag(SH.LAYER_TAG.OBJECT).pause();
        this.pause_menu.setEnabled(false);

        var pauseLayer = new PauseLayer();
        this.addChild(pauseLayer,1,SH.LAYER_TAG.PAUSE);
    },

    updateUI: function () {
        if (SH.TMPSCORE > SH.SCORE) {
            SH.SCORE += 1;
        }
        this._score_txt.setString(SH.TMPSCORE);
        this._best_txt.setString("BEST: " + SH.SCORE);
    },

    addScore: function(){
        SH.TMPSCORE += 1;
    },

    setMenuEnable: function(enable){
        this.pause_menu.setEnabled(enable);
    }
});
