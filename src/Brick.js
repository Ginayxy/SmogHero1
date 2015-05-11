/**
 * Created by yuxinyu on 2015/5/2.
 */
var Brick = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    type: 1,
    _mapIndex:0,// which map belongs to
    get mapIndex() {
        return this._mapIndex;
    },
    set mapIndex(index) {
        this._mapIndex = index;
    },

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     * @param {number 0.沙块 1.土块 2.土块（上下移动）3.土块（左右移动）}
     */
    ctor: function (spriteSheet, space, posX, type) {
        this.space = space;
        this.type = type;
        // init type
        if (this.type == 0) {
            this.sprite = new cc.PhysicsSprite("#floor_sand.png");
        } else {
            this.sprite = new cc.PhysicsSprite("#floor_earth.png");
        }

        //init animation
        if (this.type == 3) {
            var act1 = cc.moveBy(0, SH.BRICK_MOVE.V);
            var act2 = cc.moveBy(0, -SH.BRICK_MOVE.V);
            var act3 = cc.moveBy(0, -SH.BRICK_MOVE.V);
            var act4 = cc.moveBy(0, SH.BRICK_MOVE.V);
            var seq = cc.sequence(act1, act2, act3, act4);
            this.sprite.runAction(cc.repeatForever(seq));
        } else if (this == 4) {
            var act1 = cc.moveBy(SH.BRICK_MOVE.H, 0);
            var act2 = cc.moveBy(-SH.BRICK_MOVE.H, 0);
            var seq = cc.sequence(act1, act2);
            this.sprite.runAction(cc.repeatForever(seq));
        }

        var body = new cp.StaticBody();
        body.setPos(cc.p(posX, this.sprite.getContentSize().height / 2 + SH.BRICK_HEIGHT));
        this.sprite.setBody(body);

        this.shape = new cp.BoxShape(body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);
        this.shape.setCollisionType(SpriteTag.rock);

        this.space.addStaticShape(this.shape);

        spriteSheet.addChild(this.sprite);
    },

    removeFromParent: function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    getShape: function () {
        return this.shape;
    },

    getType: function () {
        return this.type;
    }

});