/**
 * Created by asus on 2015/4/6.
 */
var PauseLayer = cc.Layer.extend({

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
        this.addChild(pause_txt,1);
        //menu
        var resume_btn = new cc.MenuItemImage('#icon_setting.png', '#icon_setting_n.png', this.onResume, this);
        resume_btn.attr({x: size.width / 2 - 130, y: 550, scale: SH.SCALE});
        var home_btn = new cc.MenuItemImage('#icon_home.png', '#icon_home_n.png', this.onHome, this);
        home_btn.attr({x: size.width / 2, y: 550, scale: SH.SCALE});
        var role_btn = new cc.MenuItemImage('#icon_roles.png', '#icon_roles_n.png', this.onRole, this);
        role_btn.attr({x: size.width / 2 + 130, y: 550, scale: SH.SCALE});

        var pause_menu = new cc.Menu(resume_btn, home_btn, role_btn);
        pause_menu.setPosition(0, 0);
        this.addChild(pause_menu,1);
    },
    onResume: function () {
        if(SH.SOUND){
            var audioEngine = cc.audioEngine;
            audioEngine.playEffect(sound_res.Click_eff);
        }
        this.removeFromParent();
    },
    onHome: function () {
        if(SH.SOUND){
            var audioEngine = cc.audioEngine;
            audioEngine.playEffect(sound_res.Click_eff);
        }
        var scene = new MainMenuScene();
        cc.director.runScene(new cc.TransitionFade(0.5,scene));
    },
    onRole: function () {
        if(SH.SOUND){
            var audioEngine = cc.audioEngine;
            audioEngine.playEffect(sound_res.Click_eff);
        }
        var scene = new ShopScene();
        cc.director.runScene(new cc.TransitionFade(0.5,scene));
    }
});