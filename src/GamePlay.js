/**
 * Created by yuxinyu on 2015/4/3.
 */

var GamePlayScene = cc.Scene.extend({
    space: null,
    shapesToRemove: [],
    shapesToDrop: [],
    gameLayer: null,
    onEnter: function () {
        this._super();
        this.initPhysics();
        SH.STATE = SH.GAME_STATE.PLAY;
        this.gameLayer = new cc.Layer();
        //add three layer in the right order
        this.gameLayer.addChild(new ObjectLayer(this.space), 0, SH.LAYER_TAG.OBJECT);
        this.gameLayer.addChild(new AnimationLayer(this.space), 0, SH.LAYER_TAG.ANIMATION);
        this.addChild(new StatusLayer(), 10, SH.LAYER_TAG.STATUS);
        this.addChild(new BackgroundLayer(), 0, SH.LAYER_TAG.BACKGROUND);
        this.addChild(this.gameLayer, 0, SH.LAYER_TAG.GAMEPLAY);

        //add background music
        if (SH.MUSIC) {
            cc.audioEngine.playMusic(sound_res.Play_music, true);
        }

        this.scheduleUpdate();

    },

    // init space of chipmunk
    initPhysics: function () {
        this.space = new cp.Space();
        // Gravity
        this.space.gravity = cp.v(0, -950);
        //this.space.setIterations(2);
        this.idleSpeedThreshold = 0.1;
        // set up Walls
        var wallBottom = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, SH.GROUND_HEIGHT + 20),// start point
            cp.v(4294967295, SH.GROUND_HEIGHT + 20),// MAX INT:4294967295
            0);// thickness of wall
        wallBottom.setCollisionType(SH.SPRITE_TAG.OTHER);
        this.space.addStaticShape(wallBottom);

        // setup chipmunk CollisionHandler
        this.space.addCollisionHandler(SH.SPRITE_TAG.HERO, SH.SPRITE_TAG.DROP,
            this.collisionDropBegin.bind(this), null, null, null);
        this.space.addCollisionHandler(SH.SPRITE_TAG.HERO, SH.SPRITE_TAG.BRICK,
            this.collisionBrickBegin.bind(this), this.collisionBrickPreSolve.bind(this), null, this.collisionBrickSeparate.bind(this));
        this.space.addCollisionHandler(SH.SPRITE_TAG.HERO, SH.SPRITE_TAG.OTHER,
            this.collisionOtherBegin.bind(this), null, null, null);
        this.space.addCollisionHandler(SH.SPRITE_TAG.HERO, SH.SPRITE_TAG.SAND,
            this.collisionBrickBegin.bind(this), this.collisionSandPreSolve.bind(this), null, this.collisionBrickSeparate.bind(this));
    },

    collisionDropBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] is hero
        this.shapesToRemove.push(shapes[1]);
        if (SH.SOUND) {
            cc.audioEngine.playEffect(sound_res.Drop_eff);
        }
        var statusLayer = this.getChildByTag(SH.LAYER_TAG.STATUS);
        statusLayer.addScore();
    },
    collisionBrickBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var hero_body = shapes[0].getBody();
        var brick_spr = shapes[1].data;
        var aniLayer = this.getChildByTag(SH.LAYER_TAG.GAMEPLAY).getChildByTag(SH.LAYER_TAG.ANIMATION);
        aniLayer.setColliSprite(brick_spr);
        hero_body.setVel(cp.v(0, 0));
        return true;
    },
    collisionBrickPreSolve: function (arbiter, space) {
        SH.HERO_STAND = true;
        return true;
    },
    collisionBrickSeparate: function (arbiter, space) {
        SH.HERO_STAND = false;
    },

    collisionOtherBegin: function (arbiter, space) {
        cc.log("==game over");
        SH.TOTAL_DROP += SH.TMPSCORE;
        //stop bg music
        if (SH.MUSIC) {
            cc.audioEngine.stopMusic();
        }
        if(SH.SOUND){
            cc.audioEngine.playEffect(sound_res.Over_eff);
        }
        var shapes = arbiter.getShapes();
        var hero_spr = shapes[0].getBody().data;
        var str = "role_" + SH.ROLE + "_1.png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        hero_spr.setSpriteFrame(frame);
        //cc.director.pause();
        var statusLayer = this.getChildByTag(SH.LAYER_TAG.STATUS);
        //statusLayer.pause();
        statusLayer.setMenuEnable(false);
        statusLayer.addChild(new GameOverLayer(),11);
    },

    collisionSandPreSolve: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] is hero
        var sand = shapes[1].data;
        var fall = cc.moveBy(3, cc.p(0, -SH.BRICK_HEIGHT-20)).easing(cc.easeIn(3));
        sand.runAction(fall);
        SH.HERO_STAND = true;
        return true;
    },

    update: function (dt) {
        // chipmunk step
        var timeStep = 0.03;
        this.space.step(dt);

        for (var i = 0; i < this.shapesToRemove.length; i++) {
            var shape_remove = this.shapesToRemove[i];
            this.gameLayer.getChildByTag(SH.LAYER_TAG.OBJECT).removeObjectByShape(shape_remove);
        }
        this.shapesToRemove = [];

        for (var i = 0; i < this.shapesToDrop.length; i++) {
            var shape_drop = this.shapesToDrop[i];
            this.gameLayer.getChildByTag(SH.LAYER_TAG.OBJECT).dropObjectByShape(shape_drop);
        }
        this.shapesToRemove = [];

        var animationLayer = this.gameLayer.getChildByTag(SH.LAYER_TAG.ANIMATION);
        var eyeX = animationLayer.getEyeX();

        this.gameLayer.setPosition(cc.p(-eyeX, 0));
    }
});