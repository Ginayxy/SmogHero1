var res = {

    //mainMenu

    MMBg_png: "res/bg_spr.png",
    MMBg_plist: "res/bg_spr.plist",
    MMTitle_png: "res/MMTitle.png",
    MMButtons_plist: "res/buttons.plist",
    MMButtons_png: "res/buttons.png",
    //gamePlay
    GPBuildingB_png: "res/GPBuildingB.png",
    GPBuildingF_png: "res/GPBuildingF.png",
    Obj_plist: "res/obj_spr.plist",
    Obj_png: "res/obj_spr.png",

    //setting
    STBtn_png: "res/setting_spr.png",
    STBtn_plist: "res/setting_spr.plist",

    //store
    Role_plist:"res/role_spr.plist",
    Role_png:"res/role_spr.png",

    //config
    charmap_fnt: "res/font.fnt",
    charmap_png: "res/font.png"

};

var sound_res = {};
var sound_res_iOS = {
    Click_eff: "res/sound/click.caf",
    Coin_eff: "res/sound/coin.caf",
    Drop_eff: "res/sound/drop.caf",
    Fly_eff: "res/sound/fly.caf",
    Over_eff: "res/sound/over.caf",
    Play_music: "res/sound/play.aif"
};

var sound_res_Other = {
    Click_eff: "res/sound/click.ogg",
    Coin_eff: "res/sound/coin.ogg",
    Drop_eff: "res/sound/drop.ogg",
    Fly_eff: "res/sound/fly.ogg",
    Over_eff: "res/sound/over.ogg",
    Play_music: "res/sound/play.mp3"
};

if(cc.sys.os == cc.sys.OS_IOS){
    sound_res = sound_res_iOS;
}else{
    sound_res = sound_res_Other;
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
for(var i in sound_res){
    g_resources.push(sound_res[i]);
}