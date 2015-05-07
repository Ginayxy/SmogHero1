/**
 * Created by yuxinyu on 2015/4/3.
 */

var GamePlayScene = cc.Scene.extend({
    space:null,
    shapesToRemove:[],
    shapesToDrop:[],
    gameLayer:null,

    onEnter:function () {
        this._super();
        this.initPhysics();
        this.gameLayer = new cc.Layer();
        //add three layer in the right order
        this.gameLayer.addChild(new ObjectLayer(this.space), 0, SH.LAYER_TAG.OBJECT);
        this.gameLayer.addChild(new AnimationLayer(this.space), 0, SH.LAYER_TAG.ANIMATION);
        this.addChild(new StatusLayer(), 10, SH.LAYER_TAG.STATUS);
        this.addChild(new BackgroundLayer(), 0, SH.LAYER_TAG.BACKGROUND);
        this.addChild(this.gameLayer,0,SH.LAYER_TAG.GAMEPLAY);

        //add background music
        if (SH.MUSIC) {
            var audioEngine = cc.audioEngine;
            audioEngine.playMusic(sound_res.Play_music, true);
        }

        this.scheduleUpdate();

    },

    // init space of chipmunk
    initPhysics:function() {
        this.space = new cp.Space();
        // Gravity
        this.space.gravity = cp.v(0, -550);
        // set up Walls
        var wallBottom = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, SH.GROUND_HEIGHT),// start point
            cp.v(4294967295, SH.GROUND_HEIGHT),// MAX INT:4294967295
            0);// thickness of wall
        this.space.addStaticShape(wallBottom);

        // setup chipmunk CollisionHandler
        this.space.addCollisionHandler(SH.SPRITE_TAG.HERO, SH.SPRITE_TAG.DROP,
            this.collisionDropBegin.bind(this), null, null, null);
        this.space.addCollisionHandler(SH.SPRITE_TAG.HERO, SH.SPRITE_TAG.OTHER,
            this.collisionOtherBegin.bind(this), null, null, null);
        this.space.addCollisionHandler(SH.SPRITE_TAG.HERO, SH.SPRITE_TAG.SAND,
            this.collisionSandBegin.bind(this), null, null, null);
    },

    collisionDropBegin:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] is hero
        this.shapesToRemove.push(shapes[1]);
        if(SH.SOUND){
            cc.audioEngine.playEffect(sound_res.Drop_eff);
        }
        var animationLayer = this.getChildByTag(SH.LAYER_TAG.ANIMATION);
        animationLayer._tmpScore += 1;
    },

    collisionOtherBegin:function (arbiter, space) {
        cc.log("==game over");
        //stop bg music
        if(SH.MUSIC){
            cc.audioEngine.stopMusic();
        }
        cc.director.pause();
        //this.addChild(new GameOverLayer());
    },

    collisionSandBegin:function(arbiter, space){
        var shapes = arbiter.getShapes();
        // shapes[0] is hero
        this.shapesToDrop.push(shapes[1]);
    },

    update:function (dt) {
        // chipmunk step
        var timeStep = 0.03;
        this.space.step(timeStep);

        for(var i = 0; i < this.shapesToRemove.length; i++) {
            var shape_remove = this.shapesToRemove[i];
            this.gameLayer.getChildByTag(SH.LAYER_TAG.OBJECT).removeObjectByShape(shape_remove);
        }
        this.shapesToRemove = [];

        for(var i = 0; i < this.shapesToDrop.length; i++) {
            var shape_drop = this.shapesToDrop[i];
            this.gameLayer.getChildByTag(SH.LAYER_TAG.OBJECT).dropObjectByShape(shape_drop);
        }
        this.shapesToRemove = [];

        var animationLayer = this.gameLayer.getChildByTag(SH.LAYER_TAG.ANIMATION);
        var eyeX = animationLayer.getEyeX();

        this.gameLayer.setPosition(cc.p(-eyeX,0));
    }
});