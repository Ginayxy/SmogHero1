/**
 * Created by asus on 2015/4/6.
 */
var PauseLayer = cc.Layer.extend({
    pause_menu: null,

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        size = cc.director.getWinSize();
        // bg
        var mask = new cc.LayerColor(cc.color(0, 0, 0, 100), 800, 1136);
        mask.ignoreAnchorPointForPosition(false);
        mask.attr({x: size.width / 2, y: size.height / 2, anchorX: 0.5, anchorY: 0.5});
        this.addChild(mask);
        //title
        var pause_txt = new cc.LabelBMFont("PAUSE", res.charmap_fnt);
        pause_txt.attr({
            x: size.width / 2,
            y: 800,
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 1.2,
            color: cc.color(255, 255, 255)
        });
        this.addChild(pause_txt, 1);
        //menu
        var resume_btn = new cc.MenuItemImage('#icon_setting.png', '#icon_setting_n.png', this.onResume, this);
        resume_btn.attr({x: size.width / 2 - 170, y: 550});
        var home_btn = new cc.MenuItemImage('#icon_home.png', '#icon_home_n.png', this.onHome, this);
        home_btn.attr({x: size.width / 2, y: 550});
        var role_btn = new cc.MenuItemImage('#icon_roles.png', '#icon_roles_n.png', this.onRole, this);
        role_btn.attr({x: size.width / 2 + 170, y: 550});

        this.pause_menu = new cc.Menu(resume_btn, home_btn, role_btn);
        this.pause_menu.setPosition(0, 0);
        this.addChild(this.pause_menu, 1);
    },
    onResume: function () {
        var audioEngine = cc.audioEngine;
        if (SH.SOUND) {
            audioEngine.playEffect(sound_res.Click_eff);
            audioEngine.stopAllEffects();
        }
        if (SH.MUSIC) {
            audioEngine.resumeMusic();
        }

        this.getParent().getParent().getChildByTag(SH.LAYER_TAG.GAMEPLAY).getChildByTag(SH.LAYER_TAG.ANIMATION).resume();
        this.getParent().getParent().getChildByTag(SH.LAYER_TAG.GAMEPLAY).getChildByTag(SH.LAYER_TAG.OBJECT).resume();
        this.getParent().setMenuEnable(true);
        this.removeFromParent();
    },
    onHome: function () {
        var audioEngine = cc.audioEngine;
        if (SH.SOUND) {
            audioEngine.playEffect(sound_res.Click_eff);
        }
        var scene = new MainMenuScene();
        cc.director.runScene(scene);
    },
    onRole: function () {
        var audioEngine = cc.audioEngine;
        if (SH.SOUND) {
            audioEngine.playEffect(sound_res.Click_eff);
        }
        var scene = new ShopScene();
        cc.director.runScene(scene);
    },

    setMenuEnable: function(enable){
        this.pause_menu.setEnabled(enable);
    }
});