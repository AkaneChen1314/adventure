"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], clamp=(v, a, b)=>Math.max(a, Math.min(b, v)), pick=a=>a[Math.floor(Math.random()*a.length)], chance=n=>Math.random()<n, wait=ms=>new Promise(r=>setTimeout(r, ms));
const CLASSES={
  knight:{
    name:"守護騎士",
    icon:"⚔️",
    resource:"體力 SP",
    maxRes:70,
    hp:145,
    atk:13,
    def:6,
    crit:7,
    speed:7,
    gain:14,
    desc:"高防禦，擅長格擋與穩定輸出",
    skills:[{
      n:"重斬",
      i:"🗡️",
      c:24,
      d:1.85,
      cd:1,
      t:"強力斬擊"
    },
    {
      n:"鐵壁架勢",
      i:"🛡️",
      c:22,
      guard:.32,
      cd:2,
      t:"獲得最大生命32%的護盾"
    },
    {
      n:"騎士禱言",
      i:"✨",
      c:38,
      heal:.32,
      cd:3,
      t:"恢復32%最大生命"
    }]
  },
  rogue:{
    name:"暗影盜賊",
    icon:"🗡️",
    resource:"能量 EN",
    maxRes:100,
    hp:100,
    atk:15,
    def:2,
    crit:18,
    speed:15,
    gain:22,
    desc:"高暴擊與閃避，擅長毒傷",
    skills:[{
      n:"背刺",
      i:"🌑",
      c:34,
      d:1.7,
      crit:35,
      cd:1,
      t:"高暴擊的致命一擊"
    },
    {
      n:"淬毒飛刃",
      i:"☠️",
      c:28,
      d:.65,
      poison:7,
      cd:2,
      t:"造成傷害並附加中毒"
    },
    {
      n:"幻影連擊",
      i:"💨",
      c:55,
      d:.72,
      hits:3,
      evade:25,
      cd:3,
      t:"三連擊並提升本回合閃避"
    }]
  },
  mage:{
    name:"元素法師",
    icon:"🔮",
    resource:"魔力 MP",
    maxRes:120,
    hp:92,
    atk:17,
    def:1,
    crit:11,
    speed:9,
    gain:12,
    desc:"消耗魔力施放元素魔法與回復術",
    skills:[{
      n:"烈焰彈",
      i:"🔥",
      c:30,
      d:1.65,
      burn:6,
      cd:1,
      t:"高傷害並附加燃燒"
    },
    {
      n:"冰封術",
      i:"❄️",
      c:38,
      d:1.1,
      stun:true,
      cd:3,
      t:"造成傷害並讓敵人停止一次"
    },
    {
      n:"生命回復術",
      i:"💚",
      c:42,
      heal:.42,
      cd:3,
      t:"恢復42%最大生命"
    }]
  },
  ranger:{
    name:"荒野獵人",
    icon:"🏹",
    resource:"專注 FP",
    maxRes:90,
    hp:110,
    atk:15,
    def:3,
    crit:15,
    speed:13,
    gain:18,
    desc:"遠距離破甲、連射與野外治療",
    skills:[{
      n:"穿甲箭",
      i:"🎯",
      c:27,
      d:1.55,
      pierce:true,
      cd:1,
      t:"無視敵人防禦與護盾"
    },
    {
      n:"疾風連射",
      i:"🏹",
      c:44,
      d:.68,
      hits:3,
      cd:2,
      t:"連續射出三支箭"
    },
    {
      n:"野外急救",
      i:"🌿",
      c:34,
      heal:.3,
      cleanse:true,
      cd:3,
      t:"恢復30%生命並清除異常"
    }]
  },
  priest:{
    name:"聖光祭司",
    icon:"🕊️",
    resource:"聖力 MP",
    maxRes:115,
    hp:108,
    atk:12,
    def:4,
    crit:9,
    speed:8,
    gain:14,
    desc:"強力治療、護盾與神聖攻擊",
    skills:[{
      n:"聖光裁決",
      i:"☀️",
      c:27,
      d:1.5,
      cd:1,
      t:"以聖光攻擊敵人"
    },
    {
      n:"大回復術",
      i:"💖",
      c:40,
      heal:.48,
      cd:3,
      t:"恢復48%最大生命"
    },
    {
      n:"神聖屏障",
      i:"🔆",
      c:35,
      guard:.48,
      cd:3,
      t:"獲得最大生命48%的護盾"
    }]
  },
  berserker:{
    name:"狂戰士",
    icon:"🪓",
    resource:"怒氣 RG",
    maxRes:100,
    hp:132,
    atk:18,
    def:2,
    crit:13,
    speed:9,
    gain:19,
    desc:"受傷累積怒氣，以生命換取爆發",
    skills:[{
      n:"血怒斬",
      i:"🩸",
      c:28,
      d:2,
      self:.06,
      cd:1,
      t:"高傷害但消耗6%生命"
    },
    {
      n:"戰吼",
      i:"📣",
      c:32,
      buff:1.4,
      cd:3,
      t:"接下來兩次攻擊提高40%"
    },
    {
      n:"狂亂風暴",
      i:"🌪️",
      c:65,
      d:.88,
      hits:3,
      leech:.22,
      cd:4,
      t:"三連擊並吸取22%傷害"
    }]
  },
  god:{
    name:"上帝模式",
    icon:"👁️",
    resource:"神力 GP",
    maxRes:999,
    hp:999,
    atk:99,
    def:50,
    crit:50,
    speed:50,
    gain:999,
    godMode:true,
    desc:"密碼限定的測試／爽玩職業，擁有壓倒性能力",
    skills:[{
      n:"神之裁決",
      i:"⚡",
      c:0,
      d:25,
      pierce:true,
      cd:0,
      t:"造成極高傷害，無視敵人防禦與護盾"
    },
    {
      n:"創世恩典",
      i:"🌟",
      c:0,
      heal:1,
      cleanse:true,
      cd:0,
      t:"完全恢復生命並解除所有異常狀態"
    },
    {
      n:"絕對領域",
      i:"🌌",
      c:0,
      guard:1,
      buff:2,
      cd:0,
      t:"獲得等同最大生命的護盾，並強化攻擊"
    }]
  }
};
const MATERIALS={
  gel:{
    n:"史萊姆凝膠",
    i:"🟢"
  },
  fang:{
    n:"野狼尖牙",
    i:"🦷"
  },
  wing:{
    n:"蝙蝠翼膜",
    i:"🦇"
  },
  cloth:{
    n:"哥布林布料",
    i:"🧵"
  },
  bone:{
    n:"不死骨片",
    i:"🦴"
  },
  silk:{
    n:"毒蛛絲",
    i:"🕸️"
  },
  ore:{
    n:"魔像礦核",
    i:"🪨"
  },
  dust:{
    n:"元素粉塵",
    i:"✨"
  },
  scale:{
    n:"飛龍鱗片",
    i:"🐉"
  },
  stone:{
    n:"強化石",
    i:"💎"
  }
};
const GEAR_TIERS=[
  {id:"common", name:"普通", gold:45, amount:2},
  {id:"rare", name:"稀有", gold:105, amount:5},
  {id:"epic", name:"史詩", gold:240, amount:8},
  {id:"legendary", name:"傳說", gold:560, amount:12}
];
const CLASS_GEAR_BLUEPRINTS={
  knight:{
    material:"ore", secondary:"fang",
    weapons:["鐵衛長劍", "狼牙騎士劍", "聖銀王劍", "龍魂誓約劍"],
    weaponIcons:["🗡️", "⚔️", "⚜️", "🐲"],
    armors:["鐵衛胸甲", "王城重鎧", "聖銀守護鎧", "龍魂神鎧"],
    armorIcons:["🥋", "🛡️", "🦾", "🐉"]
  },
  rogue:{
    material:"wing", secondary:"silk",
    weapons:["新月匕首", "影翼雙匕首", "夜蛛暗刃", "虛空弒神刃"],
    weaponIcons:["🔪", "🗡️", "🕷️", "🌑"],
    armors:["暗行皮甲", "影翼斗篷", "夜蛛幻影衣", "虛空無形甲"],
    armorIcons:["🥋", "🦇", "🕸️", "🌌"]
  },
  mage:{
    material:"dust", secondary:"ore",
    weapons:["學徒法杖", "元素導能杖", "星辰秘法杖", "創世大賢者杖"],
    weaponIcons:["🪄", "🔮", "🌠", "✨"],
    armors:["魔法長袍", "元素法衣", "星辰術士袍", "創世法神袍"],
    armorIcons:["🥻", "🔥", "🌟", "🌌"]
  },
  ranger:{
    material:"fang", secondary:"silk",
    weapons:["獵人短弓", "裂牙獵弓", "蒼風穿雲弓", "龍脈星弓"],
    weaponIcons:["🏹", "🎯", "🌪️", "🌠"],
    armors:["斥候皮甲", "荒野獵裝", "蒼風遊俠甲", "龍脈追獵衣"],
    armorIcons:["🥋", "🌿", "🍃", "🐉"]
  },
  priest:{
    material:"cloth", secondary:"dust",
    weapons:["木製聖杖", "祝福權杖", "熾天使聖杖", "神諭救世權杖"],
    weaponIcons:["🪄", "☀️", "🪽", "🕊️"],
    armors:["修士白袍", "祝福祭衣", "熾天使聖衣", "神諭救世聖袍"],
    armorIcons:["🥻", "🙏", "🪽", "🌟"]
  },
  berserker:{
    material:"bone", secondary:"fang",
    weapons:["粗鐵戰斧", "血牙巨斧", "煉獄狂戰斧", "滅世龍王斧"],
    weaponIcons:["🪓", "🦷", "🔥", "🐲"],
    armors:["獸皮戰甲", "血骨狂鎧", "煉獄霸者甲", "滅世龍王鎧"],
    armorIcons:["🥋", "🦴", "🔥", "🐉"]
  }
};
function gearCost(tier, primary, secondary){
  const cost={gold:tier.gold};
  cost[primary]=(cost[primary]||0)+tier.amount;
  if(tier.id!=="common")cost[secondary]=(cost[secondary]||0)+Math.ceil(tier.amount/2);
  if(tier.id==="epic")cost.stone=(cost.stone||0)+1;
  if(tier.id==="legendary"){
    cost.scale=(cost.scale||0)+6;
    cost.stone=(cost.stone||0)+3
  }
  return cost
}
const GEAR=(()=>{
  const gear={};
  const weaponAtk=[6, 12, 22, 36];
  const armorHp=[24, 45, 75, 120];
  const armorDef=[2, 4, 7, 12];
  for(const [classId, plan] of Object.entries(CLASS_GEAR_BLUEPRINTS)){
    GEAR_TIERS.forEach((tier, index)=>{
      const weapon={
        n:plan.weapons[index], i:plan.weaponIcons[index], slot:"weapon",
        atk:weaponAtk[index], classes:[classId, "god"], r:tier.id,
        d:`${CLASSES[classId].name}專用的${tier.name}武器。`,
        cost:gearCost(tier, plan.material, plan.secondary)
      };
      const armor={
        n:plan.armors[index], i:plan.armorIcons[index], slot:"armor",
        hp:armorHp[index], def:armorDef[index], classes:[classId, "god"], r:tier.id,
        d:`${CLASSES[classId].name}專用的${tier.name}盔甲。`,
        cost:gearCost(tier, plan.material, plan.secondary)
      };
      if(classId==="knight")armor.def+=index+1;
      if(classId==="rogue"){
        weapon.crit=[2, 4, 7, 11][index];
        armor.speed=[1, 2, 3, 5][index]
      }
      if(classId==="mage")weapon.atk+=index+2;
      if(classId==="ranger"){
        weapon.crit=[1, 3, 5, 8][index];
        armor.speed=[1, 1, 2, 4][index]
      }
      if(classId==="priest")armor.hp+=10*(index+1);
      if(classId==="berserker")weapon.atk+=2*(index+1);
      gear[`${classId}_weapon_${tier.id}`]=weapon;
      gear[`${classId}_armor_${tier.id}`]=armor
    })
  }
  return gear
})();
const POTIONS={
  red:{
    n:"生命藥水",
    i:"🧪",
    heal:.35,
    cost:{
      gold:35
    },
    drop:true,
    d:"恢復 35% 最大生命。怪物可能掉落，也能在商店購買。"
  },
  blue:{
    n:"資源藥水",
    i:"🔷",
    resource:.45,
    cost:{
      gold:35
    },
    drop:true,
    d:"恢復 45% 職業資源（魔力、體力、能量等）。怪物可能掉落，也能在商店購買。"
  },
  antidote:{
    n:"解毒藥水",
    i:"🌿",
    cleanse:"poison",
    cost:{
      gold:55
    },
    d:"解除中毒。只能在商店購買。"
  },
  cooling:{
    n:"滅火藥水",
    i:"💧",
    cleanse:"burn",
    cost:{
      gold:55
    },
    d:"解除燃燒。只能在商店購買。"
  },
  bandage:{
    n:"止血藥劑",
    i:"🩹",
    cleanse:"bleed",
    cost:{
      gold:55
    },
    d:"解除流血。只能在商店購買。"
  },
  restore:{
    n:"活力藥劑",
    i:"🟡",
    cleanse:"weak",
    cost:{
      gold:70
    },
    d:"解除虛弱，恢復正常攻擊能力。只能在商店購買。"
  },
  holy:{
    n:"完全淨化藥水",
    i:"✨",
    cleanse:"all",
    cost:{
      gold:145
    },
    d:"一次解除中毒、燃燒、流血與虛弱。只能在商店購買。"
  },
  full:{
    n:"完全回復藥",
    i:"💖",
    heal:1,
    resource:1,
    cost:{
      gold:180
    },
    d:"完全恢復生命與職業資源。只能在商店購買。"
  }
};
const MONSTERS=[ {
  n:"凝膠史萊姆",
  i:"🟢",
  hp:.85,
  atk:.8,
  def:0,
  drop:"gel",
  trait:"軟體：沒有防禦力，適合熟悉戰鬥。"
},
{
  n:"月影蝙蝠",
  i:"🦇",
  hp:.7,
  atk:1.05,
  def:0,
  drop:"wing",
  bleed:2,
  trait:"撕裂：命中時附加 2 點流血，會逐回合衰減。"
},
{
  n:"森林野狼",
  i:"🐺",
  hp:.92,
  atk:1.05,
  def:1,
  drop:"fang",
  trait:"野性獵手：速度與攻擊較高，但防禦很低。"
},
{
  n:"哥布林戰士",
  i:"👺",
  hp:1,
  atk:1,
  def:2,
  drop:"cloth",
  breakBias:true,
  trait:"破甲武器：更常使用破防攻擊，削減護盾並使你虛弱。"
},
{
  n:"骷髏衛兵",
  i:"💀",
  hp:1.12,
  atk:.95,
  def:4,
  drop:"bone",
  doomAfter:3,
  doomPercent:.06,
  trait:"死亡刻印：3 次敵方行動內未擊殺，之後每次命中追加你最大生命 6% 的傷害。"
},
{
  n:"劇毒魔蛛",
  i:"🕷️",
  hp:.88,
  atk:1.12,
  def:2,
  drop:"silk",
  poison:3,
  trait:"劇毒獠牙：命中時附加 3 點中毒，會逐回合衰減。"
},
{
  n:"岩石魔像",
  i:"🗿",
  hp:1.35,
  atk:.9,
  def:7,
  drop:"ore",
  trait:"岩石裝甲：防禦很高，穿甲技能能有效克制。"
},
{
  n:"烈焰精靈",
  i:"🔥",
  hp:.95,
  atk:1.18,
  def:3,
  drop:"dust",
  burn:3,
  trait:"灼熱之觸：命中時附加 3 點燃燒，會逐回合衰減。"
},
{
  n:"深境飛龍",
  i:"🐉",
  hp:1.35,
  atk:1.16,
  def:6,
  drop:"scale",
  burn:5,
  trait:"龍焰：命中時附加 5 點燃燒，並擁有較高防禦。"
} ];
const BOSSES=[{
  n:"巨木守護者",
  i:"🌳",
  hp:2.45,
  atk:1.08,
  def:6,
  drop:"ore",
  trait:"古木甲殼：高生命與防禦，會以護盾拖長戰鬥。"
},
{
  n:"骸骨君王",
  i:"👑💀",
  hp:2.35,
  atk:1.18,
  def:8,
  drop:"bone",
  doomAfter:4,
  doomPercent:.07,
  trait:"王之死咒：4 次敵方行動後，每次命中追加最大生命 7% 傷害。"
},
{
  n:"赤焰飛龍王",
  i:"👑🐉",
  hp:2.55,
  atk:1.22,
  def:10,
  drop:"scale",
  burn:6,
  trait:"王者龍焰：命中附加 6 點燃燒，且擁有堅硬龍鱗。"
}];
const WORLD_BOSSES=[{
  n:"滅世古龍・巴哈姆特",
  i:"🐲🔥",
  hp:4.8,
  atk:1.42,
  def:16,
  drop:"scale",
  burn:8,
  doomAfter:5,
  doomPercent:.1,
  trait:"滅世倒數：5 次敵方行動後，每次命中追加最大生命 10% 傷害；龍焰附加 8 點燃燒。"
},
{
  n:"深淵魔神・阿撒托斯",
  i:"👿🌌",
  hp:5.1,
  atk:1.38,
  def:18,
  drop:"dust",
  poison:8,
  doomAfter:5,
  doomPercent:.1,
  trait:"深淵倒數：5 次敵方行動後，每次命中追加最大生命 10% 傷害；命中附加 8 點中毒。"
},
{
  n:"永夜巨像・塔爾塔洛斯",
  i:"🗿⚡",
  hp:5.4,
  atk:1.34,
  def:22,
  drop:"ore",
  doomAfter:5,
  doomPercent:.1,
  trait:"末日倒數：5 次敵方行動後，每次命中追加最大生命 10% 傷害；防禦極高。"
}];
const DIFF={
  easy:{
    hp:.82,
    atk:.75,
    reward:1.1
  },
  normal:{
    hp:1,
    atk:1,
    reward:1
  },
  hard:{
    hp:1.22,
    atk:1.28,
    reward:1.25
  }
}, ZONES=["翠葉森林",
"暮色洞窟",
"亡者荒原",
"熔岩裂谷",
"龍眠深境"], RARITY={
  common:"普通",
  rare:"稀有",
  epic:"史詩",
  legendary:"傳說"
};
const GOD_PASSWORDS=new Set(["940516", "971201"]);
let difficulty="normal", busy=false, selected=null, godUnlocked=false;
let S={
  started:false,
  classId:"knight",
  floor:0,
  kills:0,
  gold:0,
  level:1,
  xp:0,
  xpNext:100,
  hp:100,
  res:0,
  baseHp:100,
  baseAtk:10,
  baseDef:2,
  crit:5,
  speed:8,
  shield:0,
  buffs:{
  },
  debuffs:{
  },
  cooldowns:[0,
  0,
  0],
  materials:{
  },
  potions:{
  },
  gear:[],
  equipped:{
    weapon:null,
    armor:null
  },
  enemy:null,
  lastRest:0,
  nextEliteAt:3,
  logs:[],
  difficulty:"normal",
  uid:1
};
function baseClass(){
  return CLASSES[S.classId]
}
function gearByUid(uid){
  return S.gear.find(g=>g.uid===uid)
}
function stats(){
  const out={
    maxHp:S.baseHp,
    atk:S.baseAtk,
    def:S.baseDef,
    crit:S.crit,
    speed:S.speed
  };
  for(const uid of Object.values(S.equipped)){
    const inst=gearByUid(uid),
    g=inst&&GEAR[inst.id];
    if(!g)continue;
    const mult=1+inst.level*.12;
    out.atk+=Math.round((g.atk||0)*mult);
    out.maxHp+=Math.round((g.hp||0)*mult);
    out.def+=Math.round((g.def||0)*mult);
    out.crit+=g.crit||0;
    out.speed+=g.speed||0
  }
  return out
}
function save(){
  if(S.started)localStorage.setItem("abyss-adventure-v1", JSON.stringify(S))
}
function migrateGearId(id, classId){
  if(GEAR[id])return id;
  const playable=CLASS_GEAR_BLUEPRINTS[classId]?classId:"knight";
  const legacy={
    ironSword:"knight_weapon_rare",
    shadowDaggers:"rogue_weapon_rare",
    emberStaff:`${["mage", "priest"].includes(playable)?playable:"mage"}_weapon_rare`,
    hunterBow:"ranger_weapon_rare",
    dragonBlade:`${["knight", "rogue", "berserker"].includes(playable)?playable:"knight"}_weapon_legendary`,
    archStaff:`${["mage", "priest"].includes(playable)?playable:"mage"}_weapon_legendary`,
    dragonBow:"ranger_weapon_legendary",
    hideArmor:`${playable}_armor_rare`,
    boneArmor:`${playable}_armor_epic`,
    spiderCloak:`${playable}_armor_epic`,
    dragonArmor:`${playable}_armor_legendary`
  };
  return legacy[id]||null
}
function load(){
  try{
    const v=JSON.parse(localStorage.getItem("abyss-adventure-v1"));
    if(!v||!CLASSES[v.classId])return false;
    S={
      ...S,
      ...v,
      buffs:v.buffs||{
      },
      debuffs:v.debuffs||{
      },
      materials:v.materials||{
      },
      potions:v.potions||{
      },
      gear:v.gear||[]
    };
    S.gear=S.gear.map(item=>({
      ...item,
      id:migrateGearId(item.id, S.classId)
    })).filter(item=>item.id&&GEAR[item.id]);
    if(!Number.isFinite(S.nextEliteAt))S.nextEliteAt=Math.max(3, S.floor);
    difficulty=S.difficulty;
    return true
  }
  catch{
    return false
  }
}
function startGame(id){
  if(id==="god"&&!godUnlocked){
    requestGodMode();
    return
  }
  const c=CLASSES[id];
  S={
    started:true,
    classId:id,
    floor:0,
    kills:0,
    gold:45,
    level:1,
    xp:0,
    xpNext:100,
    hp:c.hp,
    res:c.maxRes,
    baseHp:c.hp,
    baseAtk:c.atk,
    baseDef:c.def,
    crit:c.crit,
    speed:c.speed,
    shield:0,
    buffs:{
    },
    debuffs:{
    },
    cooldowns:[0,
    0,
    0],
    materials:{
      gel:1
    },
    potions:{
      red:2,
      blue:1
    },
    gear:[],
    equipped:{
      weapon:null,
      armor:null
    },
    enemy:null,
    lastRest:0,
    nextEliteAt:3,
    logs:[],
    difficulty,
    uid:1
  };
  if(c.godMode){
    S.level=99;
    S.gold=999999;
    S.xpNext=999999;
    S.materials=Object.fromEntries(Object.keys(MATERIALS).map(key=>[key, 999]));
    S.potions=Object.fromEntries(Object.keys(POTIONS).map(key=>[key, 99]))
  }
  closeModal("startModal");
  log(`你以「${c.name}」開始了冒險。`, true);
  showExplore();
  render();
  save()
}
function requestGodMode(){
  $("#godPassword").value="";
  $("#godError").textContent="";
  openModal("godModal");
  setTimeout(()=>$("#godPassword").focus(), 50)
}
function unlockGodMode(){
  const password=$("#godPassword").value.trim();
  if(!GOD_PASSWORDS.has(password)){
    $("#godError").textContent="密碼錯誤，無法啟用上帝模式。";
    $("#godPassword").select();
    return
  }
  godUnlocked=true;
  closeModal("godModal");
  startGame("god");
  toast("上帝模式已解鎖")
}
function continueGame(){
  if(load()){
    S.enemy=null;
    S.shield=0;
    closeModal("startModal");
    showExplore();
    log("已繼續上次冒險。", true);
    render()
  }
}
function createEnemy(elite=false){
  S.floor++;
  const worldBoss=S.floor%50===0,
  boss=worldBoss||S.floor%5===0,
  actualElite=elite&&!boss,
  pool=worldBoss?WORLD_BOSSES:boss?BOSSES:MONSTERS.slice(clamp(Math.floor((S.floor-1)/3), 0, MONSTERS.length-4), clamp(Math.floor((S.floor-1)/3)+4, 4, MONSTERS.length)),
  m=pick(pool),
  d=DIFF[S.difficulty],
  growth=1+.095*(S.floor-1)+.0045*(S.floor-1)**2,
  eliteM=actualElite?1.38:1;
  const maxHp=Math.round(43*growth*m.hp*d.hp*eliteM),
  atk=Math.max(3, Math.round(7*(1+.068*(S.floor-1)+.0023*(S.floor-1)**2)*m.atk*d.atk*(actualElite?1.16:1)));
  if(actualElite)S.nextEliteAt=S.floor+3+Math.floor(Math.random()*3);
  S.enemy={
    ...m,
    maxHp,
    hp:maxHp,
    atk,
    shield:0,
    effects:{
      burn:0,
      poison:0,
      weak:0
    },
    worldBoss,
    boss,
    elite:actualElite,
    intent:null,
    turns:0
  };
  S.shield=0;
  S.buffs={
  };
  S.debuffs={
  };
  S.cooldowns=[0,
  0,
  0];
  rollIntent();
  showBattle();
  log(`${worldBoss?"傳說級大型首領":boss?"首領":actualElite?"菁英魔物":"魔物"}「${m.n}」出現！`, true);
  render();
  save()
}
function rollIntent(){
  if(!S.enemy)return;
  const e=S.enemy,
  r=Math.random(),
  attackCut=e.breakBias?.44:.56,
  heavyCut=e.breakBias?.59:.73,
  guardCut=e.breakBias?.71:.88;
  if(r<attackCut)e.intent={
    type:"attack",
    icon:"⚔️",
    mult:1
  };
  else if(r<heavyCut)e.intent={
    type:"heavy",
    icon:"💥",
    mult:1.55
  };
  else if(r<guardCut)e.intent={
    type:"guard",
    icon:"🛡️",
    value:Math.round(e.maxHp*.13)
  };
  else e.intent={
    type:"break",
    icon:"🔨",
    mult:.8
  }
}
function intentText(){
  const e=S.enemy,
  x=e?.intent;
  if(!x)return"";
  if(x.type==="guard")return`防禦：護盾 ${x.value}`;
  const n=Math.round(e.atk*x.mult);
  return x.type==="heavy"?`蓄力重擊：約 ${n}`:x.type==="break"?`破防攻擊：約 ${n}`:`普通攻擊：約 ${n}`
}
function intentTooltip(){
  const x=S.enemy?.intent;
  if(!x)return"";
  if(x.type==="guard")return`防禦：敵人這回合不攻擊，並獲得 ${x.value} 點護盾。`;
  if(x.type==="heavy")return"蓄力重擊：造成約 1.55 倍傷害，可以用護盾、治療或閃避應對。";
  if(x.type==="break")return"破防攻擊：命中時會削減大部分護盾，並附加虛弱，使你的攻擊傷害降低。";
  return"普通攻擊：依敵人攻擊力計算傷害，再扣除你的防禦與護盾。"
}
function enemyNoteText(e){
  const defense=e.def>0?`<span>🛡️ 防禦 ${e.def}：每次受到非穿甲攻擊時減少 ${e.def} 點傷害。</span>`:`<span>🛡️ 防禦 0：沒有傷害減免。</span>`,
  trait=e.trait?`<span>ℹ️ ${e.trait}</span>`:"",
  doom=e.doomAfter?(e.turns>=e.doomAfter?`<span class="danger">☠️ 詛咒已發動：敵人命中時追加約 ${Math.round(stats().maxHp*e.doomPercent)} 傷害。</span>`:`<span class="warning">⏳ 擊殺倒數：還剩 ${e.doomAfter-e.turns} 次敵方行動。</span>`):"";
  return defense+trait+doom
}
async function useSkill(key){
  if(busy||!S.enemy)return;
  const c=baseClass(),
  skill=key==="basic"?null:c.skills[+key];
  if(skill&&(S.res<skill.c||S.cooldowns[+key]>0)){
    toast(S.cooldowns[+key]>0?`技能還需等待 ${S.cooldowns[+key]} 回合`:"職業資源不足");
    return
  }
  busy=true;
  let total=0;
  if(!skill){
    S.res=Math.min(c.maxRes, S.res+c.gain);
    total=await dealDamage({
      d:1
    });
    log(`普通攻擊造成 ${total} 傷害，恢復 ${c.gain} 點資源。`)
  }
  else{
    S.res-=skill.c;
    S.cooldowns[+key]=skill.cd+1;
    if(skill.d){
      for(let i=0;
      i<(skill.hits||1);
      i++){
        total+=await dealDamage(skill);
        await wait(80)
      }
    }
    if(skill.guard){
      const n=Math.round(stats().maxHp*skill.guard);
      S.shield+=n;
      floatText(`護盾 +${n}`, "block", 30, 53)
    }
    if(skill.heal){
      const n=Math.round(stats().maxHp*skill.heal),
      before=S.hp;
      S.hp=Math.min(stats().maxHp, S.hp+n);
      floatText(`+${S.hp-before}`, "heal", 30, 53)
    }
    if(skill.burn)S.enemy.effects.burn+=skill.burn;
    if(skill.poison)S.enemy.effects.poison+=skill.poison;
    if(skill.stun)S.enemy.stunned=true;
    if(skill.cleanse)S.debuffs={
    };
    if(skill.evade)S.buffs.evade=skill.evade;
    if(skill.buff)S.buffs.power={
      mult:skill.buff,
      hits:2
    };
    if(skill.self)S.hp=Math.max(1, S.hp-Math.round(stats().maxHp*skill.self));
    if(skill.leech&&total)S.hp=Math.min(stats().maxHp, S.hp+Math.round(total*skill.leech));
    log(`施放「${skill.n}」${total?`，造成 ${
      total
    }
    傷害`:""}。`, true)
  }
  render();
  if(S.enemy.hp<=0){
    await victory();
    busy=false;
    return
  }
  await wait(280);
  await enemyTurn();
  busy=false;
  render();
  save()
}
async function dealDamage(skill){
  const st=stats(),
  crit=chance((st.crit+(skill.crit||0))/100),
  power=S.buffs.power?.mult||1,
  weak=S.debuffs.weak?0.8:1;
  let raw=Math.round(st.atk*skill.d*power*weak*(crit?1.65:1)*(.93+Math.random()*.14));
  if(!skill.pierce){
    const blocked=Math.min(S.enemy.shield, raw);
    S.enemy.shield-=blocked;
    raw=Math.max(1, raw-blocked-S.enemy.def)
  }
  S.enemy.hp-=raw;
  if(S.buffs.power&&--S.buffs.power.hits<=0)delete S.buffs.power;
  floatText(`${crit?"暴擊 ":""}-${raw}`, "damage", 62, 43);
  animateEnemy("hit");
  return raw
}
async function enemyTurn(){
  const e=S.enemy;
  if(!e)return;
  if(e.effects.poison){
    const n=e.effects.poison;
    e.hp-=n;
    e.effects.poison=Math.max(0, n-1);
    floatText(`中毒 -${n}`, "damage", 64, 38);
    if(e.hp<=0){
      await victory();
      return
    }
  }
  if(e.stunned){
    e.stunned=false;
    log(`${e.n} 被冰封，無法行動！`)
  }
  else if(e.intent.type==="guard"){
    e.shield+=e.intent.value;
    log(`${e.n} 獲得 ${e.intent.value} 護盾。`)
  }
  else{
    animateEnemy("attack");
    await wait(220);
    let raw=Math.max(1, Math.round(e.atk*e.intent.mult)-stats().def);
    if(e.intent.type==="break"){
      S.shield=Math.floor(S.shield*.35);
      S.debuffs.weak=2;
      log(`${e.n} 的破防攻擊削減護盾，並使你陷入虛弱！`)
    }
    const dodge=clamp((stats().speed*.55+(S.buffs.evade||0))/100, 0, .45);
    if(chance(dodge)){
      floatText("閃避", "block", 30, 52);
      log("你閃開了攻擊！")
    }
    else{
      const block=Math.min(S.shield, raw),
      damage=raw-block;
      S.shield-=block;
      S.hp-=damage;
      if(S.classId==="berserker")S.res=Math.min(baseClass().maxRes, S.res+Math.round(damage*.8));
      floatText(damage?`-${damage}`:"完全格擋", "damage", 30, 52);
      log(`${e.n} 造成 ${damage} 傷害。`);
      if(e.poison)S.debuffs.poison=(S.debuffs.poison||0)+e.poison;
      if(e.burn)S.debuffs.burn=(S.debuffs.burn||0)+e.burn;
      if(e.bleed)S.debuffs.bleed=(S.debuffs.bleed||0)+e.bleed;
      if(e.doomAfter&&e.turns>=e.doomAfter){
        const doomDamage=Math.max(1, Math.round(stats().maxHp*e.doomPercent));
        S.hp-=doomDamage;
        floatText(`死咒 -${doomDamage}`, "damage", 30, 45);
        log(`倒數詛咒追加 ${doomDamage} 傷害！`, true)
      }
    }
  }
  e.turns=(e.turns||0)+1;
  if(e.doomAfter&&e.turns===e.doomAfter)log(`☠️ ${e.n} 的倒數詛咒已發動！從下一次命中開始追加傷害。`, true);
  if(e.effects.burn){
    const n=e.effects.burn;
    e.hp-=n;
    e.effects.burn=Math.max(0, n-1);
    floatText(`燃燒 -${n}`, "damage", 66, 38)
  }
  for(const [type, label] of [["poison", "中毒"], ["burn", "燃燒"], ["bleed", "流血"]]){
    if(S.debuffs[type]){
      const n=S.debuffs[type];
      S.hp-=n;
      S.debuffs[type]=Math.max(0, n-1);
      log(`${label}造成 ${n} 點持續傷害。`)
    }
  }
  S.cooldowns=S.cooldowns.map(x=>Math.max(0, x-1));
  S.buffs.evade=0;
  if(S.debuffs.weak>0)S.debuffs.weak--;
  if(S.hp<=0){
    defeat();
    return
  }
  if(e.hp<=0){
    await victory();
    return
  }
  rollIntent()
}
async function victory(){
  const e=S.enemy;
  if(!e)return;
  const d=DIFF[S.difficulty],
  rankGold=e.worldBoss?5:e.boss?2.7:e.elite?1.7:1,
  rankXp=e.worldBoss?4.5:e.boss?2.2:e.elite?1.55:1,
  gold=Math.round((14+S.floor*2.7)*rankGold*d.reward),
  xp=Math.round((30+S.floor*3.5)*rankXp);
  S.gold+=gold;
  S.xp+=xp;
  S.kills++;
  const dropN=(e.worldBoss?10:e.boss?4:e.elite?2:1)+Math.floor(Math.random()*2);
  addMaterial(e.drop, dropN);
  if(e.elite||e.boss||chance(.16))addMaterial("stone", e.worldBoss?8:e.boss?3:1);
  let potionDrop="";
  if(chance(e.worldBoss ? .85 : .18)){
    const potionId=chance(.5)?"red":"blue";
    S.potions[potionId]=(S.potions[potionId]||0)+1;
    potionDrop=`、${POTIONS[potionId].n}×1`
  }
  log(`討伐成功：獲得 ${gold} 金幣、${xp} EXP、${MATERIALS[e.drop].n}×${dropN}${potionDrop}。`, true);
  toast(`${e.worldBoss?"傳說 Boss 討伐成功":"討伐成功"} · +${xp} EXP`);
  S.enemy=null;
  S.shield=0;
  await wait(350);
  while(S.xp>=S.xpNext){
    S.xp-=S.xpNext;
    S.level++;
    S.xpNext=Math.round(100*Math.pow(S.level, 1.3));
    S.baseHp+=11;
    S.baseAtk+=2;
    S.baseDef+=S.level%2;
    S.hp=stats().maxHp;
    S.res=baseClass().maxRes;
    toast(`升級！目前 Lv.${S.level}`);
    log(`升到 Lv.${S.level}，能力提升並完全恢復。`, true)
  }
  showExplore();
  render();
  save()
}
function defeat(){
  S.enemy=null;
  S.gold=Math.floor(S.gold*.75);
  S.floor=Math.max(0, S.floor-2);
  S.hp=stats().maxHp;
  S.res=baseClass().maxRes;
  openEvent("☠️", "冒險失敗", "你被送回兩區前，損失25%金幣；素材與裝備保留。", [{
    label:"重新整備", run:()=>{
      closeModal("eventModal");
      showExplore();
      render();
      save()
    }
  }])
}
function tryFlee(){
  if(!S.enemy||busy)return;
  busy=true;
  const rate=clamp(.45+(stats().speed-S.floor)*.015, .25, .8);
  if(chance(rate)){
    log("成功逃離戰鬥。", true);
    S.enemy=null;
    showExplore();
    busy=false;
    render();
    save()
  }
  else{
    toast("逃跑失敗");
    enemyTurn().then(()=>{
      busy=false;
      render();
      save()
    })
  }
}
function chooseRoute(type){
  if(busy||S.enemy)return;
  if(type==="rest"){
    rest();
    return
  }
  if(type==="elite"){
    if(S.floor<S.nextEliteAt){
      toast(`菁英挑戰還需前進 ${S.nextEliteAt-S.floor} 區`);
      return
    }
    createEnemy(true);
    return
  }
  S.floor++;
  const next=S.floor;
  S.floor--;
  if(next%5===0){
    createEnemy(false);
    return
  }
  const r=Math.random();
  if(r<.72)createEnemy(false);
  else if(r<.88)treasure();
  else event()
}
function rest(){
  if(S.floor-S.lastRest<3){
    toast(`再前進 ${3-(S.floor-S.lastRest)} 區才能休息`);
    return
  }
  S.lastRest=S.floor;
  S.hp=Math.min(stats().maxHp, S.hp+Math.round(stats().maxHp*.45));
  S.res=baseClass().maxRes;
  S.potions.red=(S.potions.red||0)+1;
  log("營地休息：恢復生命、職業資源並獲得生命藥水。", true);
  render();
  save()
}
function treasure(){
  S.floor++;
  const gold=25+S.floor*3;
  S.gold+=gold;
  const mat=pick(Object.keys(MATERIALS).filter(x=>x!=="stone"));
  addMaterial(mat, 2);
  openEvent("🎁", "冒險寶箱", `找到 ${gold} 金幣與 ${MATERIALS[mat].n}×2。`, [{
    label:"收下", run:()=>{
      closeModal("eventModal");
      showExplore();
      render();
      save()
    }
  }])
}
function event(){
  S.floor++;
  const heal=Math.round(stats().maxHp*.35);
  openEvent("⛲", "古老泉水", "泉水散發柔和光芒，你可以恢復生命或汲取能量。", [{
    label:"恢復生命", hint:`恢復 ${heal} HP`, run:()=>{
      S.hp=Math.min(stats().maxHp, S.hp+heal);
      finishEvent("傷口逐漸癒合。")
    }
  }, {
    label:"汲取能量", hint:"職業資源全滿", run:()=>{
      S.res=baseClass().maxRes;
      finishEvent("力量重新充滿全身。")
    }
  }])
}
function finishEvent(msg){
  closeModal("eventModal");
  log(msg, true);
  showExplore();
  render();
  save()
}
function addMaterial(id, n){
  S.materials[id]=(S.materials[id]||0)+n
}
function buyGear(id){
  if(S.enemy){
    toast("戰鬥中無法製作裝備");
    return
  }
  const g=GEAR[id];
  if(g.classes&&!g.classes.includes(S.classId)){
    toast("目前職業無法使用這把武器");
    return
  }
  if(!canPay(g.cost)){
    toast("金幣或素材不足");
    return
  }
  pay(g.cost);
  S.gear.push({
    uid:S.uid++, id, level:0
  });
  log(`製作完成：「${g.n}」。`, true);
  toast(`獲得裝備：${g.n}`);
  render();
  save()
}
function buyPotion(id){
  const p=POTIONS[id];
  if(S.enemy){
    toast("戰鬥中無法購買藥水");
    return
  }
  if(!p||!canPay(p.cost)){
    toast("金幣不足");
    return
  }
  pay(p.cost);
  S.potions[id]=(S.potions[id]||0)+1;
  log(`在商店購買「${p.n}」。`);
  toast(`購買完成：${p.n}`);
  render();
  save()
}
function canPay(cost){
  return Object.entries(cost).every(([k, v])=>k==="gold"?S.gold>=v:(S.materials[k]||0)>=v)
}
function pay(cost){
  for(const [k, v] of Object.entries(cost))k==="gold"?S.gold-=v:S.materials[k]-=v
}
function enhanceCost(level){
  const next=level+1;
  return{
    gold:30*next*next,
    stone:Math.max(1, Math.ceil(next/2))
  }
}
function enhanceRate(level){
  return[100,
  100,
  95,
  90,
  82,
  72,
  62,
  52,
  42][level]||0
}
function enhance(uid){
  if(S.enemy){
    toast("戰鬥中無法強化");
    return
  }
  const inst=gearByUid(uid);
  if(!inst||inst.level>=9)return;
  const cost=enhanceCost(inst.level);
  if(!canPay(cost)){
    toast("強化石或金幣不足");
    return
  }
  pay(cost);
  if(chance(enhanceRate(inst.level)/100)){
    inst.level++;
    toast(`強化成功：＋${inst.level}`);
    log(`${GEAR[inst.id].n} 強化至＋${inst.level}。`, true)
  }
  else{
    toast("強化失敗，裝備沒有損壞");
    log(`${GEAR[inst.id].n} 強化失敗，等級維持。`)
  }
  render();
  save()
}
function equip(uid){
  if(S.enemy){
    toast("戰鬥中無法更換裝備");
    return
  }
  const inst=gearByUid(uid),
  g=inst&&GEAR[inst.id];
  if(!g)return;
  if(g.classes&&!g.classes.includes(S.classId)){
    toast("目前職業不能裝備");
    return
  }
  S.equipped[g.slot]=S.equipped[g.slot]===uid?null:uid;
  S.hp=Math.min(S.hp, stats().maxHp);
  closeModal("itemModal");
  log(`${S.equipped[g.slot]?"裝備":"卸下"}「${g.n}${inst.level?`＋${
    inst.level
  }
  `:""}」。`);
  render();
  save()
}
function potionUseful(id){
  const p=POTIONS[id];
  if(!p)return false;
  if(p.heal&&S.hp<stats().maxHp)return true;
  if(p.resource&&S.res<baseClass().maxRes)return true;
  if(p.cleanse==="all")return ["poison",
  "burn",
  "bleed",
  "weak"].some(x=>S.debuffs[x]>0);
  if(p.cleanse)return S.debuffs[p.cleanse]>0;
  return false
}
function usePotion(id){
  if(!(S.potions[id]>0)||!potionUseful(id))return;
  const p=POTIONS[id],
  beforeHp=S.hp,
  beforeRes=S.res;
  S.potions[id]--;
  if(p.heal)S.hp=Math.min(stats().maxHp, S.hp+Math.round(stats().maxHp*p.heal));
  if(p.resource)S.res=Math.min(baseClass().maxRes, S.res+Math.round(baseClass().maxRes*p.resource));
  if(p.cleanse==="all"){
    for(const type of ["poison", "burn", "bleed", "weak"])delete S.debuffs[type]
  }
  else if(p.cleanse)delete S.debuffs[p.cleanse];
  closeModal("itemModal");
  const hpGain=S.hp-beforeHp,
  resGain=S.res-beforeRes;
  if(hpGain)floatText(`HP +${hpGain}`, "heal", 30, 53);
  else if(resGain)floatText(`資源 +${resGain}`, "block", 30, 53);
  else floatText("異常解除", "heal", 30, 53);
  log(`使用「${p.n}」。`);
  render();
  save()
}
function showExplore(){
  const arena=$("#arena"),
  next=S.floor+1;
  arena.classList.remove("elite-battle", "boss-battle", "world-boss-battle");
  $("#weatherText").textContent="探索狀態";
  $("#sceneCopy").classList.remove("hidden");
  $("#sceneCopy").innerHTML=`<p class="eyebrow">第 ${next} 區</p><h2>${next%50===0?"⚠ 傳說級大型 Boss 正在前方等待":next%5===0?"強大的首領氣息就在前方":"冒險道路延伸至迷霧深處"}</h2><p>${next%50===0?"每 50 層才會現身的災厄級敵人，請先完成裝備與強化準備。":"整理裝備與素材，準備好後繼續探索。"}</p>`;
  $("#enemyWrap").classList.remove("active");
  $("#enemyCard").classList.add("hidden");
  $("#enemyIntent").classList.add("hidden");
  $("#skillBar").classList.add("hidden");
  $("#exploreActions").classList.remove("hidden");
  $("#fleeBtn").classList.add("hidden");
  $("#turnKicker").textContent="探索階段";
  $("#turnText").textContent="選擇下一步"
}
function showBattle(){
  const arena=$("#arena"),
  e=S.enemy;
  arena.classList.toggle("elite-battle", !!e.elite);
  arena.classList.toggle("boss-battle", !!e.boss&&!e.worldBoss);
  arena.classList.toggle("world-boss-battle", !!e.worldBoss);
  $("#weatherText").textContent=e.worldBoss?"⚠ 災厄級威壓":e.boss?"⚔ 首領領域":e.elite?"✦ 菁英魔力場":"戰鬥狀態";
  $("#sceneCopy").classList.add("hidden");
  $("#enemyWrap").classList.add("active");
  $("#enemyCard").classList.remove("hidden");
  $("#enemyIntent").classList.remove("hidden");
  $("#skillBar").classList.remove("hidden");
  $("#exploreActions").classList.add("hidden");
  $("#fleeBtn").classList.remove("hidden");
  $("#turnKicker").textContent=e.worldBoss?"傳說級 Boss 戰":e.boss?"Boss 戰":e.elite?"菁英戰鬥":"戰鬥中";
  $("#turnText").textContent="選擇攻擊或職業技能"
}
function render(){
  const c=baseClass(),
  st=stats();
  S.hp=clamp(S.hp, 0, st.maxHp);
  S.res=clamp(S.res, 0, c.maxRes);
  $("#floorText").textContent=S.floor;
  $("#goldText").textContent=S.gold;
  $("#killText").textContent=S.kills;
  $("#levelText").textContent=S.level;
  $("#classText").textContent=c.name;
  $("#playerPortrait").textContent=c.icon;
  setMeter("hp", S.hp, st.maxHp);
  $("#resourceName").textContent=c.resource;
  $("#resourceLabel").textContent=`${Math.ceil(S.res)} / ${c.maxRes}`;
  $("#resourceBar").style.width=`${S.res/c.maxRes*100}%`;
  setMeter("xp", S.xp, S.xpNext);
  $("#xpAway").textContent=`距離升級還差 ${S.xpNext-S.xp} EXP`;
  $("#atkText").textContent=st.atk;
  $("#defText").textContent=st.def;
  $("#critText").textContent=`${st.crit}%`;
  $("#speedText").textContent=st.speed;
  $("#zoneText").textContent=ZONES[Math.min(ZONES.length-1, Math.floor(S.floor/5))];
  $("#arena").classList.toggle("low-hp", S.hp/st.maxHp<.28);
  renderEquipment();
  renderSkills();
  renderEnemy();
  renderBag();
  renderShop();
  renderUpgrade();
  renderEffects();
  renderRoutes()
}
function renderRoutes(){
  const rest=$("[data-route=rest]"),
  elite=$("[data-route=elite]"),
  remain=Math.max(0, S.nextEliteAt-S.floor);
  rest.disabled=S.floor-S.lastRest<3;
  elite.disabled=remain>0;
  const small=elite.querySelector?.("small"),
  desc=elite.querySelector?.("p");
  if(small)small.textContent=remain?`再前進 ${remain} 區開放`:"菁英已出現";
  if(desc)desc.textContent=remain?"目前無法連續挑戰":"可選擇挑戰，戰後再冷卻 3～5 區"
}
function setMeter(id, v, m){
  $(`#${id}Label`).textContent=`${Math.ceil(v)} / ${m}`;
  $(`#${id}Bar`).style.width=`${clamp(v/m*100,0,100)}%`
}
function renderSkills(){
  const c=baseClass();
  $("#classSkills").innerHTML=c.skills.map((s, i)=>`<button class="skill-command" data-skill="${i}" ${!S.enemy||busy||S.res<s.c||S.cooldowns[i]>0?"disabled":""}><span>${s.i}</span><div><small>${S.cooldowns[i]?`冷卻 ${
    S.cooldowns[i]
  }
  回合`:`消耗 ${
    s.c
  }
  `}</small><b>${s.n}</b><p>${s.t}</p></div></button>`).join("");
  const basic=$("[data-skill=basic]");
  if(basic)basic.disabled=!S.enemy||busy
}
function renderEnemy(){
  const e=S.enemy;
  if(!e)return;
  $("#enemySprite").textContent=e.i;
  $("#enemyName").textContent=e.n;
  $("#enemyRank").textContent=e.worldBoss?"⚠ 傳說級大型 Boss":e.boss?"深境首領":e.elite?"菁英魔物":"普通魔物";
  $("#enemyLevel").textContent=`Lv.${S.floor}`;
  $("#enemyHpLabel").textContent=`${Math.max(0,e.hp)} / ${e.maxHp}${e.shield?` 🛡️${
    e.shield
  }
  `:""}`;
  $("#enemyHpBar").style.width=`${clamp(e.hp/e.maxHp*100,0,100)}%`;
  $("#intentIcon").textContent=e.intent.icon;
  $("#intentText").textContent=intentText();
  $("#enemyIntent").dataset.tooltip=intentTooltip();
  $("#enemyIntent").tabIndex=0;
  const effects=[];
  if(e.effects.burn)effects.push({
    label:`🔥 燃燒 ${e.effects.burn}`, tip:"燃燒：每次敵人行動後受到目前層數的傷害，傷害數值每回合減少 1。"
  });
  if(e.effects.poison)effects.push({
    label:`☠️ 中毒 ${e.effects.poison}`, tip:"中毒：敵人行動前受到目前層數的傷害，傷害數值每回合減少 1。"
  });
  $("#enemyEffects").innerHTML=effects.map(x=>`<span class="status-tip" tabindex="0" data-tooltip="${x.tip}">${x.label}</span>`).join("");
  $("#enemyNote").innerHTML=enemyNoteText(e)
}
function renderEquipment(){
  for(const slot of ["weapon", "armor"]){
    const inst=gearByUid(S.equipped[slot]),
    g=inst&&GEAR[inst.id];
    $(`#${slot}Icon`).textContent=g?.i||(slot==="weapon"?baseClass().icon:"🧥");
    $(`#${slot}Name`).textContent=g?`${g.n}${inst.level?`＋${
      inst.level
    }
    `:""}`:(slot==="weapon"?"新手武器":"旅人布衣")
  }
}
function renderEffects(){
  const a=[];
  if(S.shield)a.push({
    label:`🛡️ 護盾 ${S.shield}`, tip:"護盾：優先吸收敵人造成的傷害；破防攻擊會削減大部分護盾。"
  });
  if(S.buffs.power)a.push({
    label:`📣 強攻 ${S.buffs.power.hits}`, tip:`強攻：接下來 ${S.buffs.power.hits} 次攻擊提高 ${Math.round((S.buffs.power.mult-1)*100)}% 傷害。`
  });
  if(S.debuffs.poison)a.push({
    label:`☠️ 中毒 ${S.debuffs.poison}`, tip:"中毒：每回合扣除目前數值的生命，之後數值減少 1。可用解毒藥水解除。"
  });
  if(S.debuffs.burn)a.push({
    label:`🔥 燃燒 ${S.debuffs.burn}`, tip:"燃燒：每回合扣除目前數值的生命，之後數值減少 1。可用滅火藥水解除。"
  });
  if(S.debuffs.bleed)a.push({
    label:`🩸 流血 ${S.debuffs.bleed}`, tip:"流血：每回合扣除目前數值的生命，之後數值減少 1。可用止血藥劑解除。"
  });
  if(S.debuffs.weak)a.push({
    label:`🔨 虛弱 ${S.debuffs.weak}`, tip:"虛弱：你的攻擊傷害降低 20%，剩餘回合數每回合減少 1。可用活力藥劑解除。"
  });
  $("#playerEffects").innerHTML=a.map(x=>`<span class="effect-chip status-tip" tabindex="0" data-tooltip="${x.tip}">${x.label}</span>`).join("")
}
function bagEntries(){
  const f=$(".filter.active")?.dataset.filter||"all",
  arr=[];
  for(const [id, n] of Object.entries(S.potions))if(n&&["all", "potion"].includes(f))arr.push({
    kind:"potion", id, n, name:POTIONS[id].n, icon:POTIONS[id].i, sub:"藥品"
  });
  for(const [id, n] of Object.entries(S.materials))if(n&&["all", "material"].includes(f))arr.push({
    kind:"material", id, n, name:MATERIALS[id].n, icon:MATERIALS[id].i, sub:"素材"
  });
  for(const g of S.gear){
    const x=GEAR[g.id];
    if(!x||(f!=="all"&&f!==x.slot))continue;
    arr.push({
      kind:"gear", id:g.uid, n:1, rarity:x.r, name:`${x.n}${g.level?`＋${
        g.level
      }
      `:""}`, icon:x.i, sub:`${x.slot==="weapon"?"武器":"盔甲"} · ${RARITY[x.r]}`
    })
  }
  return arr
}
function renderBag(){
  const a=bagEntries();
  const total=Object.values(S.potions).reduce((a, b)=>a+b, 0)+Object.values(S.materials).reduce((a, b)=>a+b, 0)+S.gear.length;
  $("#bagCount").textContent=total>999?"999+":total;
  $("#bagCount").title=`實際持有總數：${total}`;
  $("#inventoryList").innerHTML=a.length?a.map(x=>`<button class="item-row ${x.rarity?`rarity-${x.rarity}`:""}" data-kind="${x.kind}" data-id="${x.id}"><span class="item-icon">${x.icon}</span><span class="item-copy"><b>${x.name}</b><small>${x.sub}</small></span><span class="item-count">×${x.n}</span></button>`).join(""):`<div class="inventory-empty">目前沒有這類物品</div>`
}
function costText(cost){
  return Object.entries(cost).map(([k, v])=>k==="gold"?`🪙${v}`:`${MATERIALS[k].i}${v}`).join("　")
}
function gearEffect(g, level=0){
  const mult=1+level*.12,
  parts=[];
  if(g.atk)parts.push(`攻擊＋${Math.round(g.atk*mult)}`);
  if(g.hp)parts.push(`生命＋${Math.round(g.hp*mult)}`);
  if(g.def)parts.push(`防禦＋${Math.round(g.def*mult)}`);
  if(g.crit)parts.push(`暴擊＋${g.crit}%`);
  if(g.speed)parts.push(`速度＋${g.speed}`);
  return parts.join("、")
}
function renderShop(){
  const filter=$("[data-shop-filter].active")?.dataset.shopFilter||"all";
  const potions=Object.entries(POTIONS).map(([id, p])=>`<div class="shop-row potion-shop"><span>${p.i}</span><div class="shop-copy"><b>${p.n}${p.drop?' <em class="drop-tag">怪物可掉落</em>':' <em class="shop-tag">商店限定</em>'}</b><span class="effect-line">${p.d}</span><small><span class="cost-line">價格：${costText(p.cost)}</span> · 持有 ${S.potions[id]||0}</small></div><button data-buy-potion="${id}" ${!canPay(p.cost)||S.enemy?"disabled":""}>購買</button></div>`).join("");
  const gearRows=slot=>Object.entries(GEAR).filter(([, g])=>g.slot===slot&&g.classes.includes(S.classId)).map(([id, g])=>`<div class="shop-row rarity-${g.r}"><span>${g.i}</span><div class="shop-copy"><b>${g.n} <em class="rarity-tag ${g.r}">${RARITY[g.r]}</em></b><span class="effect-line">${gearEffect(g)}</span><small>${g.d}<br><span class="cost-line">需要：${costText(g.cost)}</span></small></div><button data-buy="${id}" ${!canPay(g.cost)||S.enemy?"disabled":""}>製作</button></div>`).join("");
  const potionSection=`<div class="shop-section-title"><b>🧪 藥水補給</b><small>異常解除藥只能在這裡購買</small></div>${potions}`;
  const weaponSection=`<div class="shop-section-title"><b>⚔️ 武器製作</b><small>每個職業都有普通至傳說四階武器</small></div>${gearRows("weapon")}`;
  const armorSection=`<div class="shop-section-title"><b>🛡️ 盔甲製作</b><small>每個職業都有普通至傳說四階盔甲</small></div>${gearRows("armor")}`;
  const sections={potion:potionSection, weapon:weaponSection, armor:armorSection};
  $("#shopList").innerHTML=filter==="all"?potionSection+weaponSection+armorSection:sections[filter]||potionSection
}
function renderUpgrade(){
  const list=S.gear.filter(x=>GEAR[x.id]);
  $("#upgradeList").innerHTML=list.length?list.map(x=>{
    const g=GEAR[x.id], next=x.level+1, cost=enhanceCost(x.level), rate=enhanceRate(x.level);
    return`<div class="upgrade-row rarity-${g.r}"><span>${g.i}</span><div class="shop-copy"><b>${g.n} <em class="rarity-tag ${g.r}">${RARITY[g.r]}</em> <span class="enhance-level">＋${x.level}</span></b>${x.level>=9?`<span class="effect-line">最終效果：${
      gearEffect(g, 9)
    }
    </span><small>已達最高強化等級</small>`:`<span class="upgrade-preview"><em>${
      gearEffect(g, x.level)
    }
    </em><strong>→</strong><em>${
      gearEffect(g, next)
    }
    </em></span><small><span class="rate-line">成功率 ${
      rate
    }
    %</span> · 需要：${
      costText(cost)
    }
    <br>失敗不降級、不損壞</small>`}</div><button data-enhance="${x.uid}" ${x.level>=9||!canPay(cost)||S.enemy?"disabled":""}>${x.level>=9?"已滿級":"強化"}</button></div>`
  }).join(""):`<div class="inventory-empty">先在商店製作一件裝備</div>`
}
function openItem(kind, id){
  selected={
    kind,
    id
  };
  let name,
  icon,
  desc,
  statsHtml="",
  primary=null;
  if(kind==="potion"){
    const p=POTIONS[id];
    name=p.n;
    icon=p.i;
    desc=p.d;
    primary={
      label:"使用",
      run:()=>usePotion(id),
      disabled:!potionUseful(id)
    }
  }
  else if(kind==="material"){
    const m=MATERIALS[id];
    name=m.n;
    icon=m.i;
    desc="怪物掉落的製作與強化素材。";
    statsHtml=`<div>持有<br><b>${S.materials[id]||0}</b></div>`
  }
  else{
    const inst=gearByUid(+id),
    g=inst&&GEAR[inst.id];
    if(!g)return;
    name=`${g.n}${inst.level?`＋${
      inst.level
    }
    `:""}`;
    icon=g.i;
    desc=g.d;
    const mult=1+inst.level*.12;
    statsHtml=[["攻擊",
    g.atk&&Math.round(g.atk*mult)],
    ["生命",
    g.hp&&Math.round(g.hp*mult)],
    ["防禦",
    g.def&&Math.round(g.def*mult)],
    ["暴擊",
    g.crit&&g.crit+"%"],
    ["速度",
    g.speed]].filter(x=>x[1]).map(x=>`<div>${x[0]}<br><b>＋${x[1]}</b></div>`).join("");
    primary={
      label:S.equipped[g.slot]===inst.uid?"卸下":"裝備",
      run:()=>equip(inst.uid)
    }
  }
  $("#itemIcon").textContent=icon;
  $("#itemTitle").textContent=name;
  $("#itemRarity").textContent=kind==="gear"?RARITY[GEAR[gearByUid(+id).id].r]:kind==="material"?"素材":"消耗品";
  $("#itemDescription").textContent=desc;
  $("#itemStats").innerHTML=statsHtml;
  const box=$("#itemActions");
  box.innerHTML="";
  box.append(button("關閉", ()=>closeModal("itemModal")));
  if(primary){
    const b=button(primary.label, primary.run, "primary");
    b.disabled=primary.disabled||false;
    box.append(b)
  }
  openModal("itemModal")
}
function log(msg, important=false){
  S.logs.unshift({
    msg, important, t:new Date().toLocaleTimeString("zh-TW", {
      hour:"2-digit", minute:"2-digit"
    })
  });
  S.logs=S.logs.slice(0, 60);
  const page=$("#logPage");
  page.innerHTML=S.logs.map(x=>`<div class="log-row ${x.important?"important":""}"><small>${x.t}</small>　${x.msg}</div>`).join("");
  page.scrollTop=0
}
function floatText(t, c, x, y){
  const n=document.createElement("span");
  n.className=`float-text ${c}`;
  n.textContent=t;
  n.style.left=x+"%";
  n.style.top=y+"%";
  $("#floatLayer").append(n);
  setTimeout(()=>n.remove(), 1050)
}
function animateEnemy(c){
  const e=$("#enemyWrap");
  e.classList.remove(c);
  void e.offsetWidth;
  e.classList.add(c);
  setTimeout(()=>e.classList.remove(c), 380)
}
function toast(t){
  const n=document.createElement("div");
  n.className="toast";
  n.textContent=t;
  $("#toastStack").append(n);
  setTimeout(()=>n.remove(), 2600)
}
function button(t, run, c=""){
  const b=document.createElement("button");
  b.textContent=t;
  b.className=c;
  b.onclick=run;
  return b
}
function openModal(id){
  $("#"+id).classList.add("open")
}
function closeModal(id){
  $("#"+id).classList.remove("open")
}
function openEvent(i, t, d, opts){
  $("#eventIcon").textContent=i;
  $("#eventTitle").textContent=t;
  $("#eventDescription").textContent=d;
  const b=$("#eventOptions");
  b.innerHTML="";
  for(const o of opts){
    const x=button(o.label, o.run, o.primary?"primary":"");
    if(o.hint)x.innerHTML=`${o.label}<small>${o.hint}</small>`;
    b.append(x)
  }
  openModal("eventModal")
}
document.addEventListener("click", e=>{
  const sk=e.target.closest("[data-skill]");
  if(sk)useSkill(sk.dataset.skill);
  const r=e.target.closest("[data-route]");
  if(r)chooseRoute(r.dataset.route);
  const it=e.target.closest("[data-kind]");
  if(it)openItem(it.dataset.kind, it.dataset.id);
  const buy=e.target.closest("[data-buy]");
  if(buy)buyGear(buy.dataset.buy);
  const potion=e.target.closest("[data-buy-potion]");
  if(potion)buyPotion(potion.dataset.buyPotion);
  const up=e.target.closest("[data-enhance]");
  if(up)enhance(+up.dataset.enhance);
  const sl=e.target.closest("[data-equip-slot]");
  if(sl&&S.equipped[sl.dataset.equipSlot])openItem("gear", S.equipped[sl.dataset.equipSlot]);
  const c=e.target.closest("[data-close]");
  if(c)closeModal(c.dataset.close);
  const tab=e.target.closest("[data-tab]");
  if(tab){
    $$('[data-tab]').forEach(x=>x.classList.toggle("active", x===tab));
    $$('.tab-page').forEach(x=>x.classList.remove("active"));
    $("#"+tab.dataset.tab+"Page").classList.add("active")
  }
  const f=e.target.closest("[data-filter]");
  if(f){
    $$('[data-filter]').forEach(x=>x.classList.toggle("active", x===f));
    renderBag()
  }
  const sf=e.target.closest("[data-shop-filter]");
  if(sf){
    $$('[data-shop-filter]').forEach(x=>x.classList.toggle("active", x===sf));
    renderShop()
  }
});
$("#classGrid").innerHTML=Object.entries(CLASSES).map(([id, c])=>`<button class="class-card${c.godMode?' god-class':''}" data-class="${id}"><span>${c.icon}</span><b>${c.name}</b><small>${c.desc}</small>${c.godMode?'<em class="god-lock">🔒 密碼限定</em>':''}<div class="class-stats"><i>HP <strong>${c.hp}</strong></i><i>攻擊 <strong>${c.atk}</strong></i><i>防禦 <strong>${c.def}</strong></i><i>爆擊 <strong>${c.crit}%</strong></i><i>速度 <strong>${c.speed}</strong></i><i>${c.resource} <strong>${c.maxRes}</strong></i></div></button>`).join("");
$("#classGrid").onclick=e=>{
  const b=e.target.closest("[data-class]");
  if(b)startGame(b.dataset.class)
};
$("#difficultyButtons").onclick=e=>{
  const b=e.target.closest("[data-difficulty]");
  if(b){
    difficulty=b.dataset.difficulty;
    $$('[data-difficulty]').forEach(x=>x.classList.toggle("active", x===b))
  }
};
$("#continueBtn").onclick=continueGame;
$("#fleeBtn").onclick=tryFlee;
$("#introBtn").onclick=()=>openModal("introModal");
$("#helpBtn").onclick=()=>openModal("helpModal");
$("#godUnlockBtn").onclick=unlockGodMode;
$("#godPassword").addEventListener("keydown", e=>{
  if(e.key==="Enter")unlockGodMode()
});
$("#resetBtn").onclick=()=>{
  if(confirm("確定刪除存檔並重新選擇職業嗎？")){
    localStorage.removeItem("abyss-adventure-v1");
    location.reload()
  }
};
if(localStorage.getItem("abyss-adventure-v1"))$("#continueBtn").classList.remove("hidden");
render();
