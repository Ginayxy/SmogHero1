/**
 * Created by asus on 2015/4/6.
 */
var GameOverLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        size = cc.director.getWinSize();
        // bg
        var mask = new cc.LayerColor(cc.color(0, 0, 0, 200), 800, 1136);
        mask.ignoreAnchorPointForPosition(false);
        mask.attr({x: size.width / 2, y: size.height / 2, anchorX: 0.5, anchorY: 0.5});
        this.addChild(mask);
        //title
        var over_txt = new cc.LabelBMFont("GAMEOVER", res.charmap_fnt);
        over_txt.attr({ x: size.width / 2, y: 950, anchorX: 0.5, anchorY: 0.5, scale: 1.2, color: cc.color(225, 225, 225) });
        var title = new cc.Sprite("#txt_score.png");
        title.attr({x:size.width/2, y: 750, scale:0.9});
        var tmpScore = SH.TMPSCORE ? SH.TMPSCORE : "0";
        var score_txt = new cc.LabelBMFont(tmpScore, res.charmap_fnt);
        score_txt.attr({ x: size.width / 2, y: 550, anchorX: 0.5,anchorY: 0.5,scale: 2,color: cc.color(176, 224, 230)});
        this.addChild(over_txt,1);
        this.addChild(title,1);
        this.addChild(score_txt,1);

        //menu
        var resume_btn = new cc.MenuItemImage('#icon_setting.png', '#icon_setting_n.png', this.onResume, this);
        resume_btn.attr({x: size.width / 2 - 170, y: 550});
        var home_btn = new cc.MenuItemImage('#icon_home.png', '#icon_home_n.png', this.onHome, this);
        home_btn.attr({x: size.width / 2, y: 550});
        var role_btn = new cc.MenuItemImage('#icon_roles.png', '#icon_roles_n.png', this.onRole, this);
        role_btn.attr({x: size.width / 2 + 170, y: 550});

        var pause_menu = new cc.Menu(resume_btn, home_btn, role_btn);
        pause_menu.setPosition(0, -350);
        this.addChild(pause_menu,1);

        if ('touches' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {return false;}
            }, this);
        } else {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {return false;}
            }, this);
        }

    },
    onResume: function () {
        var audioEngine = cc.audioEngine;
        if(SH.SOUND){
            audioEngine.stopAllEffects();
            audioEngine.playEffect(sound_res.Click_eff);
        }
        var gameplay = new GamePlayScene();
        cc.director.resume();
        cc.director.runScene(gameplay);
    },
    onHome: function () {
        var audioEngine = cc.audioEngine;
        if(SH.SOUND){
            audioEngine.stopAllEffects();
            audioEngine.playEffect(sound_res.Click_eff);
        }
        var scene = new MainMenuScene();
        cc.director.resume();
        cc.director.runScene(scene);
    },
    onRole: function () {
        var audioEngine = cc.audioEngine;
        if(SH.SOUND){
            audioEngine.stopAllEffects();
            audioEngine.playEffect(sound_res.Click_eff);

        }
        var scene = new ShopScene();
        cc.director.resume();
        cc.director.runScene(scene);
    }
});