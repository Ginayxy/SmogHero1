/**
 * Created by yuxinyu on 4/13.
 */
var SettingLayer = cc.Layer.extend({
    _cloud1: null,
    _cloud2: null,
    _flag: 1,

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(res.MMBg_plist);
        cc.spriteFrameCache.addSpriteFrames(res.STBtn_plist);
        cc.spriteFrameCache.addSpriteFrames(res.Obj_plist);
        // 背景
        var bg = new cc.LayerGradient(cc.color(255, 252, 209), cc.color(172, 255, 250), cc.p(0, 1));
        bg.ignoreAnchorPointForPosition(false);
        bg.attr({x: size.width / 2, y: size.height / 2, anchorX: 0.5, anchorY: 0.5});
        bg.changeWidth(800);
        bg.changeHeight(1136);
        this.addChild(bg, 0);

        var title = new cc.Sprite('#title_setting.png');
        title.attr({x: size.width / 2, y: 1000});
        this.addChild(title, 0);

        var buildings = new cc.Sprite('#buildings.png');
        buildings.attr({x: size.width / 2, y: -200, anchorX: 0.5, anchorY: 0});
        this.addChild(buildings, 0);

        this._cloud1 = new cc.Sprite('#bg_cloud1.png');
        this._cloud2 = new cc.Sprite('#bg_cloud2.png');
        this._cloud1.attr({x: size.width / 2 - 300, y: 780});
        this._cloud2.attr({x: size.width / 2 + 320, y: 640});
        this.addChild(this._cloud1);
        this.addChild(this._cloud2);
        this.schedule(function () {
            this._flag = -this._flag;
            this._cloud1.runAction(cc.moveBy(2, cc.p(50 * this._flag, 0)));
            this._cloud2.runAction(cc.moveBy(2, cc.p((-50) * this._flag, 0)));
        }, 2, cc.REPEAT_FOREVER, 1);

        // 菜单
        var sound_btn = new cc.MenuItemImage('#setting_sound.png');
        var sound_btn_n = new cc.MenuItemImage('#setting_sound_n.png');
        var music_btn = new cc.MenuItemImage('#setting_music.png');
        var music_btn_n = new cc.MenuItemImage('#setting_music_n.png');
        var home_btn = new cc.MenuItemImage('#icon_home.png', '#icon_home_n.png', this.onBack, this);

        var soundBtnToggle = new cc.MenuItemToggle(sound_btn, sound_btn_n, this.onSoundControl, this);
        var musicBtnToggle = new cc.MenuItemToggle(music_btn, music_btn_n, this.onMusicControl, this);
        musicBtnToggle.setScale(0.9);
        soundBtnToggle.setScale(0.9);
        musicBtnToggle.attr({x: size.width / 2, y: 650});
        soundBtnToggle.attr({x: size.width / 2, y: 450});
        home_btn.attr({x: size.width / 2 + 310, y: 100});

        var menu = new cc.Menu(musicBtnToggle, soundBtnToggle, home_btn);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 10);

        return true;
    },

    onSoundControl: function () {
        SH.SOUND = !SH.SOUND;
        var audioEngine = cc.audioEngine;
        if (SH.SOUND) {
            audioEngine.playEffect(res.Click_ogg);
        } else {
            audioEngine.stopAllEffects();
        }
    },

    onMusicControl: function () {
        SH.MUSIC = !SH.MUSIC;
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect(res.Click_ogg);
        if (SH.MUSIC) {

        } else {
            audioEngine.stopMusic();
        }
    },

    onBack: function () {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect(res.Click_ogg);
        cc.director.popScene();
    }
});