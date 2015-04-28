/**
 * Created by yuxinyu on 3/27.
 */
var MainMenuLayer = cc.Layer.extend({
    _superman: null,

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(res.MMBg_plist);
        cc.spriteFrameCache.addSpriteFrames(res.MMButtons_plist);
        cc.spriteFrameCache.addSpriteFrames(res.Role_plist);
        // 颜色渐变图层
        var bg = new cc.LayerGradient(cc.color(246, 237, 213), cc.color(196, 196, 196), cc.p(0, 1));
        // 背景
        var title = new cc.Sprite(res.MMTitle_png);
        var buildings = new cc.Sprite('#buildings.png');
        var rope = new cc.Sprite('#Rope.png');
        bg.ignoreAnchorPointForPosition(false);
        bg.attr({x: size.width / 2, y: size.height / 2, anchorX: 0.5, anchorY: 0.5});
        bg.changeWidth(800);
        bg.changeHeight(1136);
        title.attr({x: size.width / 2, y: 900});
        buildings.attr({x: size.width / 2, y: 0, anchorX: 0.5, anchorY: 0});
        buildings.setOpacity(210);
        rope.attr({x: size.width / 2, y: 950, anchorX: 0.5, anchorY: 1});
        this.addChild(bg, 0);
        this.addChild(title, 2);
        this.addChild(buildings);
        this.addChild(rope, 1);

        // 动画
        this._superman = new cc.Sprite('#role_superman_2.png');
        this._superman.setScale(0.5);
        this.addChild(this._superman, 11, 4);
        this._superman.attr({x: size.width / 2 - 400, y: Math.random() * size.height / 2, anchorX: 0, anchorY: 0});
        this._superman.runAction(cc.moveBy(5, cc.p(800, 0)));

        // 文字
        var play_txt = new cc.LabelBMFont('PLAY', res.charmap_fnt);
        play_txt.attr({x: size.width / 2, y: size.height / 2});
        play_txt.setColor(cc.color(255, 255, 255));
        play_txt.setScale(0.8);
        //this.addChild(play_txt);

        // 按钮
        var play_btn = new cc.MenuItemImage('#Playbtn_up.png','#Playbtn_down.png', this.onPlay, this);
        var role_btn = new cc.MenuItemImage('#Rolebtn_up.png', '#Rolebtn_down.png', this.onRole, this);
        var setting_btn = new cc.MenuItemImage('#Settingbtn_up.png','#Settingbtn_down.png', this.onSetting, this);

        play_btn.x = size.width / 2;
        play_btn.y = 650;
        role_btn.x = size.width / 2 - 61;
        role_btn.y = 500;
        setting_btn.x = size.width / 2 + 61;
        setting_btn.y = 500;

        var menu = new cc.Menu(play_btn, role_btn, setting_btn);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 2, 10);

        this.schedule(this.update, 0.1);

        return true;
    },

    onPlay: function () {
        if(SH.SOUND){
            cc.audioEngine.playEffect(res.Click_ogg);
        }
        var gameplay = new GamePlayScene();
        cc.director.pushScene(new cc.TransitionFade(0.5,gameplay));
    },

    onRole: function () {
        var audioEngine = cc.audioEngine;
        if(SH.SOUND){
            audioEngine.playEffect(res.Click_ogg);
        }
        var scene = new cc.Scene();
        scene.addChild(new ShopLayer());
        cc.director.pushScene(new cc.TransitionFade(0.5, scene));
    },

    onSetting: function () {
        var audioEngine = cc.audioEngine;
        if(SH.SOUND){
            audioEngine.playEffect(res.Click_ogg);
        }
        var scene = new cc.Scene();
        scene.addChild(new SettingLayer());
        cc.director.pushScene(new cc.TransitionFade(0.5, scene));
    },

    update: function () {
        if (this._superman.x > size.width / 2 + 399) {
            this._superman.visible = false;
            this._superman.y = Math.random() * size.height;
            this._superman.x = size.width / 2 - 400;
            this.scheduleOnce(function () {
                this._superman.runAction(cc.moveBy(5, cc.p(800, 0)));
                this._superman.visible = true;
            }, Math.random() * 10 + 10);
        }
    }
});

var MainMenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});
