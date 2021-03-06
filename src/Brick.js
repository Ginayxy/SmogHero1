/**
 * Created by yuxinyu on 2015/5/2.
 */
var Brick = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    type: 1,
    _mapIndex: 0,// which map belongs to
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

        var contentSize = this.sprite.getContentSize();
        //var body = new cp.StaticBody();
        //body.setPos(cc.p(posX, contentSize.height / 2 + SH.BRICK_HEIGHT));
        var body = new cp.Body(100, cp.momentForBox(1, contentSize.width- 30, contentSize.height));
        body.p = cc.p(posX, contentSize.height / 2 + SH.BRICK_HEIGHT);
        //this.space.addBody(body);

        this.shape = new cp.BoxShape(body, contentSize.width - 10, contentSize.height);
        if (this.type == 0) {
            this.shape.setCollisionType(SH.SPRITE_TAG.SAND);
        } else {
            this.shape.setCollisionType(SH.SPRITE_TAG.BRICK);
        }
        this.shape.setFriction(0.99);
        this.shape.setElasticity(0);
        this.space.addShape(this.shape);
        this.sprite.setBody(body);
        spriteSheet.addChild(this.sprite);
        this.shape.data = this.sprite;

        //body.applyForce(cp.v(0, 55000), cp.v(0, 0));

        //init animation
        if (this.type == 2) {
            var act1 = cc.moveBy(SH.SPEED, cc.p(0, SH.BRICK_MOVE.V));
            var act2 = cc.moveBy(SH.SPEED, cc.p(0, -SH.BRICK_MOVE.V));
            var act3 = cc.moveBy(SH.SPEED, cc.p(0, -SH.BRICK_MOVE.V));
            var act4 = cc.moveBy(SH.SPEED, cc.p(0, SH.BRICK_MOVE.V));
            var seq = cc.sequence(act1, act2, act3, act4);
            this.sprite.runAction(cc.repeatForever(seq));
        } else if (this.type == 3) {
            var act1 = cc.moveBy(SH.SPEED, cc.p(SH.BRICK_MOVE.H, 0));
            var act2 = cc.moveBy(SH.SPEED, cc.p(-SH.BRICK_MOVE.H, 0));
            var seq = cc.sequence(act1, act2);
            this.sprite.runAction(cc.repeatForever(seq));
        }
    },

    removeFromParent: function () {
        this.space.removeShape(this.shape);
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